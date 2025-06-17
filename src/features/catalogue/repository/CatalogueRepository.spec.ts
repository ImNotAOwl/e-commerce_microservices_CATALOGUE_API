import { CatalogueRepository } from './CatalogueRepository';
import { ICatalogueRepository } from '../interfaces/ICatalogueRepository';
import { Logger } from '../../../infrastructure/logging/Logger';
import { Article } from '../entity/Article';
import { UpdateItem } from '../../../types/catalogue';
import { DateTime } from 'luxon';

// Mock implementations
const mockPrismaClient = {
  article: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(),
};

const mockLoggerInstance = {
  logger: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

jest.mock('../../../infrastructure/logging/Logger');

// Mock la méthode statique `getInstance` pour qu'elle retourne l'instance mockée
(Logger.getInstance as jest.Mock).mockReturnValue(mockLoggerInstance);

describe('CatalogueRepository', () => {
  let repository: ICatalogueRepository;
  let logger: Logger;

  beforeEach(() => {
    logger = Logger.getInstance();
    repository = new CatalogueRepository(logger);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an article successfully', async () => {
      const article: Article = {
        title: 'Test',
        description: 'Test Desc',
        image: 'test.jpg',
        brand: 'nike',
        price: 100,
        quantity: 10,
      };
      const createdAt = DateTime.now().toUnixInteger();
      const createdArticle = { ...article, id: '123', createdAt };

      (mockPrismaClient.article.create as jest.Mock).mockResolvedValue(createdArticle);

      const result = await repository.create(article);

      expect(mockPrismaClient.article.create).toHaveBeenCalledWith({
        data: {
          ...article,
          createdAt,
        },
      });
      expect(result).toEqual(createdArticle);
    });

    it('should throw an error if creation fails', async () => {
      const mockError = new Error('Database error');
      const article: Article = {
        title: 'Test',
        description: 'Test Desc',
        image: 'test.jpg',
        brand: 'nike',
        price: 100,
        quantity: 10,
      };

      (mockPrismaClient.article.create as jest.Mock).mockRejectedValue(mockError);

      await expect(repository.create(article)).rejects.toThrow(
        'An error occurred while creating an article.'
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error creating article',
        JSON.stringify(mockError)
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve articles with pagination', async () => {
      const articles = [
        {
          id: '1',
          title: 'A',
          description: 'Desc',
          image: 'img.jpg',
          price: 10,
          quantity: 5,
          createdAt: DateTime.now().toUnixInteger(),
        },
      ];
      const totalDocuments = 1;

      (mockPrismaClient.article.findMany as jest.Mock).mockResolvedValue(articles);
      (mockPrismaClient.article.count as jest.Mock).mockResolvedValue(totalDocuments);

      const result = await repository.findAll(10, 0);

      expect(mockPrismaClient.article.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(mockPrismaClient.article.count).toHaveBeenCalled();
      expect(result).toEqual({ items: articles, total: totalDocuments });
    });

    it('should throw an error if retrieval fails', async () => {
      const mockError = new Error('Database error');

      (mockPrismaClient.article.findMany as jest.Mock).mockRejectedValue(mockError);

      await expect(repository.findAll(10, 0)).rejects.toThrow(
        'An error occurred while retrieving articles.'
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error retrieving articles',
        JSON.stringify(mockError)
      );
    });
  });

  describe('update', () => {
    it('should update articles successfully', async () => {
      const items: UpdateItem[] = [{ articleId: '1', qteCmd: 10 }];
      const updatedArticles = [{ id: '1', quantity: 0 }];

      (mockPrismaClient.$transaction as jest.Mock).mockResolvedValue(updatedArticles);

      const result = await repository.update(items);

      expect(mockPrismaClient.$transaction).toHaveBeenCalledWith(
        items.map((item) =>
          mockPrismaClient.article.update({
            where: { id: item.articleId },
            data: { quantity: { decrement: item.qteCmd } },
          })
        )
      );
      expect(result).toEqual(updatedArticles);
    });

    it('should throw an error if update fails', async () => {
      const items: UpdateItem[] = [{ articleId: '1', qteCmd: 10 }];
      const mockError = new Error('Database error');

      (mockPrismaClient.$transaction as jest.Mock).mockRejectedValue(mockError);

      await expect(repository.update(items)).rejects.toThrow(
        'An error occurred while updating articles.'
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error updating articles',
        JSON.stringify(mockError)
      );
    });
  });
});
