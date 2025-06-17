import pino, { Logger as PinoLogger } from 'pino';
import * as rfs from 'rotating-file-stream';
import path from 'path';

export class Logger {
  private static instance: Logger | null = null;
  private readonly logger: PinoLogger;

  private constructor() {
    const logDirectory = path.join(process.env.LOGS_PATH ?? `.`, 'logs');
    const logFileStream = rfs.createStream(`application.log`, {
      interval: '1d',
      path: logDirectory,
      compress: 'gzip',
      size: '10M',
    });

    const prettyStream = pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: true,
        ignore: 'pid,hostname',
      },
    });

    const streams = [
      { stream: prettyStream }, // Affichage dans la console
      { stream: logFileStream }, // Enregistrement avec rotation
    ];

    // Configurer Pino avec la rotation de fichier
    this.logger = pino(
      {
        level: process.env.LOG_LEVEL || 'info', // Niveau de log configurable via les variables d'environnement
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          log: (log) => {
            return {
              ...log,
              environment: process.env.NODE_ENV || 'development', // Environnement
              service: 'catalogue-service',
              requestId: log.requestId || 'unknown',
            };
          },
        },
      },
      pino.multistream(streams)
    );
  }

  // Méthode pour obtenir ou créer l'instance unique
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Méthodes de log
  info(message: string, payload?: string): void {
    this.logger.info(payload ? { payload } : {}, message);
  }

  error(message: string, payload?: string): void {
    this.logger.error(payload ? { payload } : {}, message);
  }

  warn(message: string, payload?: string): void {
    this.logger.warn(payload ? { payload } : {}, message);
  }

  debug(message: string, payload?: string): void {
    this.logger.debug(payload ? { payload } : {}, message);
  }
}
