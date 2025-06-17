import { DateTime } from 'luxon';
import { FindReturn, UpdateItem } from '../../../types/catalogue';
import { Article } from '../entity/Article';
import { ICatalogueRepository } from '../interfaces/ICatalogueRepository';
import { PrismaClient } from '@prisma/client';
import { Logger } from '../../../infrastructure/logging/Logger';

export class CatalogueRepository implements ICatalogueRepository {
  private readonly client: PrismaClient;
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.client = new PrismaClient();
    this.logger = logger;
  }

  async create(data: Article): Promise<Article> {
    const { title, description, image, price, quantity, brand } = data;
    const createdAt = DateTime.now().toUnixInteger();

    try {
      const item = await this.client.article.create({
        data: {
          title,
          description,
          image,
          price,
          quantity,
          brand,
          createdAt,
        },
      });

      return item;
    } catch (error) {
      this.logger.error('Error creating article', JSON.stringify(error));
      throw new Error('An error occurred while creating an article.');
    }
  }

  async findAll(limit: number, offset: number): Promise<FindReturn> {
    try {
      const items = await this.client.article.findMany({
        skip: offset,
        take: limit,
      });

      const totalDocuments = await this.client.article.count();

      return { items, total: totalDocuments };
    } catch (error) {
      this.logger.error('Error retrieving articles', JSON.stringify(error));
      throw new Error('An error occurred while retrieving articles.');
    }
  }

  async update(items: UpdateItem[]): Promise<Article[]> {
    try {
      const updates = await this.client.$transaction(
        items.map((item) =>
          this.client.article.update({
            where: { id: item.articleId },
            data: { quantity: { decrement: item.qteCmd } },
          })
        )
      );

      return updates;
    } catch (error) {
      this.logger.error('Error updating articles', JSON.stringify(error));
      throw new Error('An error occurred while updating articles.');
    }
  }
}
