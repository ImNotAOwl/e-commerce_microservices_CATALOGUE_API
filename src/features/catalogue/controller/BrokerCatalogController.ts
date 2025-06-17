// controller/BrokerCatalogController.ts
import { IMessageBrokerHandler } from '../../../infrastructure/message-broker/interfaces/IMessageBrokerHandler';
import { MessageHandlerRegistry } from '../../../infrastructure/message-broker/handlers/MessageHandlerRegistry';
import { Logger } from '../../../infrastructure/logging/Logger';

export class BrokerCatalogController {
  private readonly messageBroker: IMessageBrokerHandler;
  private readonly handlerRegistry: MessageHandlerRegistry;
  private readonly logger: Logger;

  constructor(
    messageBroker: IMessageBrokerHandler,
    handlerRegistry: MessageHandlerRegistry,
    logger: Logger
  ) {
    this.messageBroker = messageBroker;
    this.handlerRegistry = handlerRegistry;
    this.logger = logger;
  }

  async startMessageBroker(): Promise<void> {
    const handlers = this.handlerRegistry.getHandlers();
    for (const [exchange, handler] of handlers.entries()) {
      await this.messageBroker.connect(exchange);
      this.logger.info(`Message broker connected to ${exchange} queue`);
      await this.messageBroker.startListening(async (msg: string) => {
        await handler.handleMessage(msg);
      });
    }
  }
}
