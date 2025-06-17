import Router from 'koa-router';
import { CatalogueRepository } from '../features/catalogue/repository/CatalogueRepository';
import { CatalogueInteractor } from '../features/catalogue/interactor/CatalogueInteractor';
import { HttpCatalogController } from '../features/catalogue/controller/HttpCatalogController';
import { ApiResponse } from '../infrastructure/api-response/ApiResponse';
import { Logger } from '../infrastructure/logging/Logger';

const logger = Logger.getInstance();
const apiResponse = new ApiResponse();
const repository = new CatalogueRepository(logger);
const interactor = new CatalogueInteractor(repository, apiResponse, logger);
const controller = new HttpCatalogController(interactor, logger);

const router = new Router({
  prefix: '/api/catalogue',
});

router
  .get('/', controller.onGetArticles.bind(controller))
  .post('/', controller.onCreateArticle.bind(controller))
  .put('/quantity', controller.onUpdateArticles.bind(controller));

export default router;
