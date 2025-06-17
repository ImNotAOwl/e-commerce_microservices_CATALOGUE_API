import { MessageHandlerRegistry } from './MessageHandlerRegistry';
import { IMessageHandler } from './interfaces/IMessageHandler';

describe('MessageHandlerRegistry', () => {
  let registry: MessageHandlerRegistry;
  let mockHandler: IMessageHandler;

  beforeEach(() => {
    registry = new MessageHandlerRegistry();
    mockHandler = {
      handleMessage: jest.fn().mockResolvedValue(undefined),
    };
  });

  describe('registerHandler', () => {
    it('should register a handler for a given exchange', () => {
      registry.registerHandler('exchange1', mockHandler);
      expect(registry.getHandler('exchange1')).toBe(mockHandler);
    });
  });

  describe('getHandler', () => {
    it('should return the correct handler for a given exchange', () => {
      registry.registerHandler('exchange1', mockHandler);
      const handler = registry.getHandler('exchange1');
      expect(handler).toBe(mockHandler);
    });

    it('should return undefined if no handler is registered for the given exchange', () => {
      const handler = registry.getHandler('nonexistent');
      expect(handler).toBeUndefined();
    });
  });

  describe('getHandlers', () => {
    it('should return all registered handlers', () => {
      registry.registerHandler('exchange1', mockHandler);
      registry.registerHandler('exchange2', mockHandler);

      const handlers = registry.getHandlers();
      expect(handlers.size).toBe(2);
      expect(handlers.get('exchange1')).toBe(mockHandler);
      expect(handlers.get('exchange2')).toBe(mockHandler);
    });
  });
});
