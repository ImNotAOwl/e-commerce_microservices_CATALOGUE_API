import { IMessageHandler } from './interfaces/IMessageHandler';
import { UpdateItem } from '../../../types/catalogue';
import { ICatalogueInteractor } from '../../../features/catalogue/interfaces/ICatalogueInteractor';
import { Logger } from '../../logging/Logger';
import { IApiResponse } from '../../api-response/interfaces/IApiResponse';

export class UpdateArticlesHandler implements IMessageHandler {
  private readonly interactor: ICatalogueInteractor;
  private readonly logger: Logger;

  constructor(interactor: ICatalogueInteractor, logger: Logger) {
    this.interactor = interactor;
    this.logger = logger;
  }

  async handleMessage(msg: string): Promise<void> {
    const items: UpdateItem[] = JSON.parse(msg);
    try {
      await this.interactor.updateArticles(items);
    } catch (error) {
      const { message = 'An error occurred' } = error as IApiResponse;
      this.logger.error(`Error updating articles: ${message}`);
    }
  }
}
