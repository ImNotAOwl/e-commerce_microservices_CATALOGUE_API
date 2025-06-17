import { UpdateArticlesResponse, UpdateItem } from '../../../types/catalogue';
import { Article } from '../entity/Article';
import { ICatalogueInteractor } from '../interfaces/ICatalogueInteractor';
import { Context } from 'koa';
import { Logger } from '../../../infrastructure/logging/Logger';
import { HttpCatalogController } from './HttpCatalogController';
import { IApiResponse } from '../../../infrastructure/api-response/interfaces/IApiResponse';

describe('HttpCatalogController', () => {
  let controller: HttpCatalogController;
  let interactorMock: jest.Mocked<ICatalogueInteractor>;
  let loggerMock: jest.Mocked<Logger>;
  let ctx: Context;

  beforeEach(() => {
    interactorMock = {
      createArticle: jest.fn(),
      getArticles: jest.fn(),
      updateArticles: jest.fn(),
    } as unknown as jest.Mocked<ICatalogueInteractor>;

    loggerMock = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    controller = new HttpCatalogController(interactorMock, loggerMock);

    ctx = {
      request: { body: {}, query: {} },
      status: 0,
      body: null,
    } as unknown as Context;
  });

  describe('onCreateArticle', () => {
    it('should create an article successfully', async () => {
      const article: Article = {
        title: 'Introduction à TypeScript',
        description:
          'Un livre détaillé pour apprendre les bases et les concepts avancés de TypeScript.',
        image: 'https://example.com/images/typescript-book.jpg',
        price: 35,
        quantity: 100,
        brand: 'FitTrack',
        rating: 4.7,
      };
      // { id: '1', title: 'Test', content: 'Content' };
      const interactorResponse = {
        status: 201,
        message: 'Created',
        article,
      } as unknown as IApiResponse;

      interactorMock.createArticle.mockResolvedValue(interactorResponse);
      ctx.request.body = article;

      await controller.onCreateArticle(ctx);

      expect(interactorMock.createArticle).toHaveBeenCalledWith(article);
      expect(ctx.status).toBe(201);
      expect(ctx.body).toEqual({ message: 'Created', article });
      expect(loggerMock.info).toHaveBeenCalledWith(
        'Creating article with data:',
        JSON.stringify(article)
      );
    });

    it('should handle errors when creating an article', async () => {
      const error = { status: 400, message: 'Invalid data' };
      interactorMock.createArticle.mockRejectedValue(error);
      ctx.request.body = {};

      await controller.onCreateArticle(ctx);

      expect(ctx.status).toBe(400);
      expect(ctx.body).toEqual({ message: 'Invalid data' });
      expect(loggerMock.error).toHaveBeenCalledWith(
        'Error creating article:',
        JSON.stringify(error)
      );
    });
  });

  describe('onGetArticles', () => {
    it('should fetch articles successfully', async () => {
      const articles = [{ id: '1', title: 'Test', content: 'Content' }];
      const interactorResponse = {
        status: 200,
        message: 'Fetched',
        articles,
      } as unknown as IApiResponse;

      interactorMock.getArticles.mockResolvedValue(interactorResponse);
      ctx.query = { limit: '5', offset: '10' };

      await controller.onGetArticles(ctx);

      expect(interactorMock.getArticles).toHaveBeenCalledWith(5, 10);
      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual({ message: 'Fetched', articles });
      expect(loggerMock.info).toHaveBeenCalledWith(
        'Fetching articles with limit=5, offset=10'
      );
    });

    it('should handle errors when fetching articles', async () => {
      const error = { status: 500, message: 'Server error' };
      interactorMock.getArticles.mockRejectedValue(error);
      ctx.query = {};
      await controller.onGetArticles(ctx);

      expect(ctx.status).toBe(500);
      expect(ctx.body).toEqual({ message: 'Server error' });
      expect(loggerMock.error).toHaveBeenCalledWith(
        'Error fetching articles:',
        JSON.stringify(error)
      );
    });
  });

  describe('onUpdateArticles', () => {
    it('should update articles successfully', async () => {
      const updates: UpdateItem[] = [{ articleId: '1', qteCmd: 2 }];
      const interactorResponse = {
        status: 200,
        message: 'Updated',
        articles: updates,
      } as UpdateArticlesResponse;

      interactorMock.updateArticles.mockResolvedValue(interactorResponse);
      ctx.request.body = { items: [...updates] };

      await controller.onUpdateArticles(ctx);

      expect(interactorMock.updateArticles).toHaveBeenCalledWith(updates);
      expect(ctx.status).toBe(200);
      expect(ctx.body).toEqual({ message: 'Updated', articles: updates });
      expect(loggerMock.info).toHaveBeenCalledWith(
        'Updating articles with data:',
        JSON.stringify(updates)
      );
    });

    it('should handle errors when updating articles', async () => {
      const error = { status: 400, message: 'Invalid updates' };
      interactorMock.updateArticles.mockRejectedValue(error);

      await controller.onUpdateArticles(ctx);

      expect(ctx.status).toBe(400);
      expect(ctx.body).toEqual({ message: 'Invalid updates' });
      expect(loggerMock.error).toHaveBeenCalledWith(
        'Error updating articles:',
        JSON.stringify(error)
      );
    });
  });
});
