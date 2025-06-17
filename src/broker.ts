import { BrokerCatalogController } from './features/catalogue/controller/BrokerCatalogController';
import { CatalogueInteractor } from './features/catalogue/interactor/CatalogueInteractor';
import { ICatalogueInteractor } from './features/catalogue/interfaces/ICatalogueInteractor';
import { CatalogueRepository } from './features/catalogue/repository/CatalogueRepository';
import { ApiResponse } from './infrastructure/api-response/ApiResponse';
import { Logger } from './infrastructure/logging/Logger';
import { MessageHandlerRegistry } from './infrastructure/message-broker/handlers/MessageHandlerRegistry';
import { UpdateArticlesHandler } from './infrastructure/message-broker/handlers/UpdateArticlesHandler';
import { MessageBrokerHandler } from './infrastructure/message-broker/MessageBrokerHandler';

const logger = Logger.getInstance();
const apiResponse = new ApiResponse();
const repository = new CatalogueRepository(logger);

const catalogueInteractor: ICatalogueInteractor = new CatalogueInteractor(
  repository,
  apiResponse,
  logger
);

const messageBrokerHandler = new MessageBrokerHandler(logger);
const handlerRegistry = new MessageHandlerRegistry();

// Enregistrer les handlers pour différents exchanges
handlerRegistry.registerHandler(
  'catalog-updateQuantity',
  new UpdateArticlesHandler(catalogueInteractor, logger)
);

const brokerCatalogController = new BrokerCatalogController(
  messageBrokerHandler,
  handlerRegistry,
  logger
);

// Démarrez l'écoute du broker
brokerCatalogController.startMessageBroker().catch(console.error);
