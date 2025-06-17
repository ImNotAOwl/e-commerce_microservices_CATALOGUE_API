import { Order, UpdateItem } from '../../../types/catalogue';
import { Article } from '../entity/Article';
import { ICatalogueInteractor } from '../interfaces/ICatalogueInteractor';
import { Context } from 'koa';
import { Logger } from '../../../infrastructure/logging/Logger';
import { IApiResponse } from '../../../infrastructure/api-response/interfaces/IApiResponse';

export class HttpCatalogController {
  private readonly interactor: ICatalogueInteractor;
  private readonly logger: Logger;

  constructor(interactor: ICatalogueInteractor, logger: Logger) {
    this.interactor = interactor;
    this.logger = logger;
  }

  async onCreateArticle(ctx: Context) {
    try {
      const { body } = ctx.request;
      this.logger.info('Creating article with data:', JSON.stringify(body));

      const { status, message, ...rest } = await this.interactor.createArticle(
        body as Article
      );

      ctx.status = status;
      ctx.body = { message, ...rest };
      this.logger.info(
        'Article created successfully:',
        JSON.stringify({ status, message })
      );
    } catch (error) {
      const { status = 500, message = 'An error occurred' } = error as IApiResponse;
      this.logger.error('Error creating article:', JSON.stringify(error));

      ctx.status = status;
      ctx.body = { message };
    }
  }

  async onGetArticles(ctx: Context) {
    try {
      const offset = parseInt(`${ctx.query.offset}`) || 0;
      const limit = parseInt(`${ctx.query.limit}`) || 10;
      this.logger.info(`Fetching articles with limit=${limit}, offset=${offset}`);

      const { status, message, ...rest } = await this.interactor.getArticles(
        limit,
        offset
      );

      ctx.status = status;
      ctx.body = { message, ...rest };
      this.logger.info(
        'Articles fetched successfully:',
        JSON.stringify({ status, message })
      );
    } catch (error) {
      const { status = 500, message = 'An error occurred' } = error as IApiResponse;
      this.logger.error('Error fetching articles:', JSON.stringify(error));

      ctx.status = status;
      ctx.body = { message };
    }
  }

  async onUpdateArticles(ctx: Context) {
    try {
      console.log(ctx.request.body);

      const { items }: { items: UpdateItem[] } = ctx.request.body as Order;
      this.logger.info('Updating articles with data:', JSON.stringify(items));

      const { status, message, articles } = await this.interactor.updateArticles(items);

      ctx.status = status;
      ctx.body = { message, articles };
      this.logger.info(
        'Articles updated successfully:',
        JSON.stringify({ status, message, articles })
      );
    } catch (error) {
      const { status = 500, message = 'An error occurred' } = error as IApiResponse;
      this.logger.error('Error updating articles:', JSON.stringify(error));

      ctx.status = status;
      ctx.body = { message };
    }
  }
}
