import { IMessageHandler } from './interfaces/IMessageHandler';

export class MessageHandlerRegistry {
  private readonly handlers: Map<string, IMessageHandler> = new Map();

  registerHandler(exchange: string, handler: IMessageHandler): void {
    this.handlers.set(exchange, handler);
  }

  getHandler(exchange: string): IMessageHandler | undefined {
    return this.handlers.get(exchange);
  }

  getHandlers(): Map<string, IMessageHandler> {
    return this.handlers;
  }
}
