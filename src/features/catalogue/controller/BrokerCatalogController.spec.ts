import { BrokerCatalogController } from './BrokerCatalogController';
import { IMessageBrokerHandler } from '../../../infrastructure/message-broker/interfaces/IMessageBrokerHandler';
import { MessageHandlerRegistry } from '../../../infrastructure/message-broker/handlers/MessageHandlerRegistry';
import { Logger } from '../../../infrastructure/logging/Logger';

describe('BrokerCatalogController', () => {
  let messageBrokerMock: jest.Mocked<IMessageBrokerHandler>;
  let handlerRegistryMock: jest.Mocked<MessageHandlerRegistry>;
  let loggerMock: jest.Mocked<Logger>;
  let controller: BrokerCatalogController;

  beforeEach(() => {
    messageBrokerMock = {
      connect: jest.fn(),
      startListening: jest.fn(),
    } as unknown as jest.Mocked<IMessageBrokerHandler>;

    handlerRegistryMock = {
      getHandlers: jest.fn(),
    } as unknown as jest.Mocked<MessageHandlerRegistry>;

    loggerMock = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    controller = new BrokerCatalogController(
      messageBrokerMock,
      handlerRegistryMock,
      loggerMock
    );
  });

  describe('startMessageBroker', () => {
    it('should connect to each exchange and start listening for messages', async () => {
      // Arrange: Simuler des handlers pour deux échanges
      const mockHandlers = new Map([
        ['exchange1', { handleMessage: jest.fn() }],
        ['exchange2', { handleMessage: jest.fn() }],
      ]);
      handlerRegistryMock.getHandlers.mockReturnValue(mockHandlers);

      // Act
      await controller.startMessageBroker();

      // Assert: Vérifier la connexion aux échanges
      expect(messageBrokerMock.connect).toHaveBeenCalledWith('exchange1');
      expect(messageBrokerMock.connect).toHaveBeenCalledWith('exchange2');
      expect(messageBrokerMock.connect).toHaveBeenCalledTimes(2);

      // Vérifier que le logger a été appelé pour chaque échange
      expect(loggerMock.info).toHaveBeenCalledWith(
        'Message broker connected to exchange1 queue'
      );
      expect(loggerMock.info).toHaveBeenCalledWith(
        'Message broker connected to exchange2 queue'
      );
      expect(loggerMock.info).toHaveBeenCalledTimes(2);

      // Vérifier que le message broker démarre l'écoute
      expect(messageBrokerMock.startListening).toHaveBeenCalledTimes(2);
    });

    it('should call the appropriate message handler for each message', async () => {
      // Arrange: Mock d'un gestionnaire et d'un message
      const mockHandler = { handleMessage: jest.fn() };
      const mockMessage = 'value';
      const mockHandlers = new Map([['exchange1', mockHandler]]);
      handlerRegistryMock.getHandlers.mockReturnValue(mockHandlers);

      // Simuler l'écoute du broker
      messageBrokerMock.startListening.mockImplementation(async (callback) => {
        await callback(mockMessage);
      });

      // Act
      await controller.startMessageBroker();

      // Assert: Vérifier que le gestionnaire a été appelé avec le bon message
      expect(mockHandler.handleMessage).toHaveBeenCalledWith(mockMessage);
      expect(mockHandler.handleMessage).toHaveBeenCalledTimes(1);
    });

    it('should log an error if an exception occurs while processing a message', async () => {
      // Arrange: Simuler une exception dans un gestionnaire
      const mockHandler = {
        handleMessage: jest.fn().mockRejectedValue(new Error('Handler error')),
      };
      const mockMessage = 'value';
      const mockHandlers = new Map([['exchange1', mockHandler]]);
      handlerRegistryMock.getHandlers.mockReturnValue(mockHandlers);

      // Simuler l'écoute du broker
      messageBrokerMock.startListening.mockImplementation(async (callback) => {
        try {
          await callback(mockMessage);
        } catch (error) {
          loggerMock.error(`Error processing message: ${error}`);
        }
      });

      // Act
      await controller.startMessageBroker();

      // Assert: Vérifier que l'erreur a été loggée
      expect(loggerMock.error).toHaveBeenCalledWith(
        'Error processing message: Error: Handler error'
      );
    });
  });
});
