import amqplib, { Connection, Channel } from 'amqplib';
import { IMessageBrokerHandler } from './interfaces/IMessageBrokerHandler';
import { Logger } from '../logging/Logger';

export class MessageBrokerHandler implements IMessageBrokerHandler {
  private client: Connection | null = null;
  private channel: Channel | null = null;
  private exchange: string | null = null;
  private readonly logger: Logger;

  // Injection du logger dans le constructeur
  constructor(logger: Logger) {
    this.logger = logger;
  }

  // Initialise la connexion et le canal
  async connect(exchange: string): Promise<void> {
    try {
      let connected = false;
      let retries = 5;

      while (!connected && retries > 0) {
        try {
          this.client = await amqplib.connect({
            protocol: process.env.RABBITMQ_PROTOCOL,
            hostname: process.env.RABBITMQ_HOST,
            port: Number(process.env.RABBITMQ_PORT),
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
            vhost: process.env.RABBITMQ_VHOST,
          });
          connected = true;
          this.logger.info('Connected to RabbitMQ');
        } catch (error) {
          this.logger.error('Error connecting to RabbitMQ', JSON.stringify(error));
          this.logger.info(`Retrying in 5 seconds... (${retries} retries left)`);
          retries -= 1;
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }

      this.channel = await this.client!.createChannel();
      this.exchange = exchange;
      await this.channel.assertExchange(this.exchange, 'direct', { durable: false });

      this.logger.info(`RabbitMQ exchange '${this.exchange}' is ready.`);
    } catch (error) {
      this.logger.error('Error connecting to RabbitMQ:', JSON.stringify(error));
    }
  }

  // Envoie un message dans la file d'attente
  async sendMessage(message: string, routingKey: string): Promise<void> {
    if (!this.channel || !this.exchange) {
      this.logger.error("Channel is not available. Did you forget to call 'connect()'?");
      return;
    }

    this.channel.publish(this.exchange, routingKey, Buffer.from(message));
    this.logger.info(
      `Message sent to exchange '${this.exchange}' with routingKey '${routingKey}': ${message}`
    );
  }

  // Démarre l'écoute de la file d'attente pour traiter les messages entrants
  async startListening(onMessage: (msg: string) => void): Promise<void> {
    if (!this.channel || !this.exchange) {
      this.logger.error("Channel is not available. Did you forget to call 'connect()'?");
      return;
    }

    try {
      const q = await this.channel.assertQueue('', { exclusive: true });
      await this.channel.bindQueue(q.queue, this.exchange, this.exchange);

      this.channel.consume(
        q.queue,
        (msg) => {
          if (msg !== null) {
            const content = msg.content.toString();
            this.logger.info(
              `Received message from exchange '${this.exchange}': ${content}`
            );
            onMessage(content);
          }
        },
        { noAck: true }
      );

      this.logger.info(`Listening for messages on exchange '${this.exchange}'`);
    } catch (error) {
      this.logger.error('Error starting message listener:', JSON.stringify(error));
    }
  }

  // Ferme la connexion proprement
  async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.client?.close();
      this.logger.info('RabbitMQ connection closed.');
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection:', JSON.stringify(error));
    }
  }
}
