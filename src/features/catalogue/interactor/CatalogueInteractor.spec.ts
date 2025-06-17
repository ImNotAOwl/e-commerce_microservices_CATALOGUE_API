import { CatalogueInteractor } from './CatalogueInteractor';
import { ICatalogueRepository } from '../interfaces/ICatalogueRepository';
import { IApiResponse } from '../../../infrastructure/api-response/interfaces/IApiResponse';
import { Logger } from '../../../infrastructure/logging/Logger';
import { Article } from '../entity/Article';
import { UpdateItem } from '../../../types/catalogue';
import pino from 'pino';

// Mock implementations
const mockRepository: ICatalogueRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
};

const mockApiResponse: IApiResponse = {
  status: 200,
  message: '',

  setMessage: jest.fn(function (this: IApiResponse, message: string) {
    this.message = message;
    return this; // Retourne l'instance courante pour le chaînage
  }),

  setStatus: jest.fn(function (this: IApiResponse, status: number) {
    this.status = status;
    return this;
  }),

  addData: jest.fn(function (this: IApiResponse) {
    // On peut imaginer stocker les données ici si nécessaire
    return this;
  }),

  buildSuccess: jest.fn(function (
    this: IApiResponse,
    message: string,
    data: object,
    status: number = 200
  ) {
    this.message = message;
    this.status = status;
    // Ajoute éventuellement des données si c'est implémenté dans la vraie classe
    return this;
  }),

  buildError: jest.fn(function (
    this: IApiResponse,
    message: string,
    status: number = 400
  ) {
    this.message = message;
    this.status = status;
    return this;
  }),
};

const mockLoggerInstance = {
  logger: pino(), // Simule un objet `PinoLogger`
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

jest.mock('../../../infrastructure/logging/Logger');

// Mock la méthode statique `getInstance` pour qu'elle retourne l'instance mockée
(Logger.getInstance as jest.Mock).mockReturnValue(mockLoggerInstance);

describe('CatalogueInteractor', () => {
  let interactor: CatalogueInteractor;
  let logger: Logger;

  beforeEach(() => {
    logger = Logger.getInstance();
    interactor = new CatalogueInteractor(mockRepository, mockApiResponse, logger);
    jest.clearAllMocks();
  });

  describe('createArticle', () => {
    it('should create an article when all fields are provided', async () => {
      const article: Article = {
        title: 'Test',
        description: 'Test Desc',
        image: 'test.jpg',
        brand: 'nike',
        price: 100,
        quantity: 10,
      };
      (mockRepository.create as jest.Mock).mockResolvedValue({ id: '123' });

      const result = await interactor.createArticle(article);

      expect(mockRepository.create).toHaveBeenCalledWith(article);
      expect(mockApiResponse.buildSuccess).toHaveBeenCalledWith(
        'Article successfully created',
        { articleId: '123' }
      );
      expect(result.message).toBe('Article successfully created');
      expect(result.status).toBe(200);
    });

    it('should throw an error when required fields are missing', async () => {
      const article: Partial<Article> = { title: 'Test' };

      await expect(interactor.createArticle(article as Article)).rejects.toMatchObject({
        message: 'All fields are required',
      });
      expect(logger.error).toHaveBeenCalledWith(
        'Missing required fields for article creation',
        JSON.stringify(article)
      );
    });
  });

  describe('getArticles', () => {
    it('should retrieve articles with pagination', async () => {
      const articles = [
        {
          id: '1',
          title: 'A',
          description: 'Desc',
          image: 'img.jpg',
          price: 10,
          quantity: 5,
        },
      ];
      (mockRepository.findAll as jest.Mock).mockResolvedValue({
        items: articles,
        total: 1,
      });

      const result = await interactor.getArticles(10, 0);

      expect(mockRepository.findAll).toHaveBeenCalledWith(10, 0);
      expect(mockApiResponse.buildSuccess).toHaveBeenCalledWith(
        'Articles successfully retrieved',
        {
          items: articles,
          pagination: { offset: 0, limit: 10, count: 1, total: 1 },
        }
      );
      expect(result.message).toBe('Articles successfully retrieved');
      expect(result.status).toBe(200);
    });

    it('should handle repository errors gracefully', async () => {
      const error = new Error('Error: Database error');

      (mockRepository.findAll as jest.Mock).mockRejectedValue(error);

      await expect(interactor.getArticles(10, 0)).rejects.toMatchObject({
        message: 'Error: Database error',
      });

      expect(logger.error).toHaveBeenCalledWith(
        'Error retrieving articles',
        JSON.stringify(error)
      );
    });
  });

  describe('updateArticles', () => {
    it('should update articles successfully', async () => {
      const items: UpdateItem[] = [{ articleId: '1', qteCmd: 10 }];
      const returnItems = [{ id: '1', quantity: 10 }];
      (mockRepository.update as jest.Mock).mockResolvedValue(returnItems);

      const result = await interactor.updateArticles(items);

      expect(mockRepository.update).toHaveBeenCalledWith(items);
      expect(mockApiResponse.buildSuccess).toHaveBeenCalledWith(
        'Articles successfully updated',
        { articles: returnItems }
      );
      expect(result.message).toBe('Articles successfully updated');
      expect(result.status).toBe(200);
    });

    it('should handle repository errors gracefully', async () => {
      const items = [{ articleId: '1', qteCmd: 10 }];
      (mockRepository.update as jest.Mock).mockRejectedValue(
        new Error('Error: Database error')
      );

      await expect(interactor.updateArticles(items)).rejects.toMatchObject({
        message: 'Error: Database error',
      });
      expect(logger.error).toHaveBeenCalledWith('Error updating articles');
    });
  });
});
