import { Logger } from './Logger';
import pino from 'pino';

jest.mock('pino', () => {
  const transportMock = jest.fn();
  const multistreamMock = jest.fn();

  const pinoInstanceMock = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  const pinoMock = jest.fn(() => pinoInstanceMock) as unknown as typeof pino;
  pinoMock.transport = transportMock;
  pinoMock.multistream = multistreamMock;

  // Mock de stdTimeFunctions
  Object.defineProperty(pinoMock, 'stdTimeFunctions', {
    value: {
      isoTime: jest.fn().mockReturnValue('mocked-timestamp'),
    },
    writable: false,
  });

  return pinoMock;
});

// Mock de rotating-file-stream
jest.mock('rotating-file-stream', () => ({
  createStream: jest.fn(),
}));

// Mock de path
jest.mock('path', () => {
  return {
    join: jest.fn().mockReturnValue('/mocked/path/logs'),
  };
});

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = Logger.getInstance();
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = Logger.getInstance();
      const instance2 = Logger.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('info', () => {
    it('should log an info message', () => {
      const message = 'Test info message';
      const payload = JSON.stringify({ key: 'value' });

      logger.info(message, payload);

      expect(pino().info).toHaveBeenCalledWith({ payload }, message);
    });
  });

  describe('error', () => {
    it('should log an error message', () => {
      const message = 'Test error message';
      const payload = JSON.stringify({ key: 'value' });

      logger.error(message, payload);

      expect(pino().error).toHaveBeenCalledWith({ payload }, message);
    });
  });

  describe('warn', () => {
    it('should log a warn message', () => {
      const message = 'Test warn message';
      const payload = JSON.stringify({ key: 'value' });

      logger.warn(message, payload);

      expect(pino().warn).toHaveBeenCalledWith({ payload }, message);
    });
  });

  describe('debug', () => {
    it('should log a debug message', () => {
      const message = 'Test debug message';
      const payload = JSON.stringify({ key: 'value' });

      logger.debug(message, payload);

      expect(pino().debug).toHaveBeenCalledWith({ payload }, message);
    });
  });
});
