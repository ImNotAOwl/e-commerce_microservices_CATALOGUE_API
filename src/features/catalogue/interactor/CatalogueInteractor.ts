import { UpdateItem } from '../../../types/catalogue';
import { Article } from '../entity/Article';
import { ICatalogueInteractor } from '../interfaces/ICatalogueInteractor';
import { ICatalogueRepository } from '../interfaces/ICatalogueRepository';
import { IApiResponse } from '../../../infrastructure/api-response/interfaces/IApiResponse';
import { Logger } from '../../../infrastructure/logging/Logger';

export class CatalogueInteractor implements ICatalogueInteractor {
  private readonly repository: ICatalogueRepository;
  private readonly apiResponse: IApiResponse;
  private readonly logger: Logger;

  constructor(
    repository: ICatalogueRepository,
    apiResponse: IApiResponse,
    logger: Logger
  ) {
    this.repository = repository;
    this.apiResponse = apiResponse;
    this.logger = logger;
  }

  async createArticle(body: Article) {
    const { title, description, image, price, quantity } = body;

    if (
      !title ||
      !description ||
      !image ||
      price === undefined ||
      quantity === undefined
    ) {
      this.logger.error(
        'Missing required fields for article creation',
        JSON.stringify(body)
      );
      throw this.apiResponse.buildError('All fields are required');
    }

    try {
      const article = await this.repository.create(body);

      return this.apiResponse.buildSuccess('Article successfully created', {
        articleId: article.id,
      });
		} catch (error) {
			const err = error as Error;
      this.logger.error('Error creating article', JSON.stringify(error));
      throw this.apiResponse.buildError(err.message, 500);
    }
  }

  async getArticles(limit: number, offset: number) {
    try {
      const { items, total } = await this.repository.findAll(limit, offset);

      return this.apiResponse.buildSuccess('Articles successfully retrieved', {
        items,
        pagination: {
          offset,
          limit,
          count: items.length,
          total,
        },
      });
		} catch (error: unknown) {
			const err = error as Error
      this.logger.error('Error retrieving articles', JSON.stringify(error));
      throw this.apiResponse.buildError(err.message, 500);
    }
  }

  async updateArticles(items: UpdateItem[]) {
    try {
      const updatedItems = await this.repository.update(items);
      const articles = updatedItems.map((el) => {
        const { id, quantity } = el;
        return { id, quantity };
      });

      return this.apiResponse.buildSuccess('Articles successfully updated', { articles });
		} catch (error) {
			const err = error as Error;
      this.logger.error('Error updating articles');
      throw this.apiResponse.buildError(err.message, 500);
    }
  }
}
