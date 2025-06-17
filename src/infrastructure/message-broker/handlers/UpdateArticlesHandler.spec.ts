import { UpdateArticlesHandler } from './UpdateArticlesHandler';
import { ICatalogueInteractor } from '../../../features/catalogue/interfaces/ICatalogueInteractor';
import { Logger } from '../../logging/Logger';

describe('UpdateArticlesHandler', () => {
  let interactor: ICatalogueInteractor;
  let logger: Logger;
  let handler: UpdateArticlesHandler;

  beforeEach(() => {
    // Mock complet de ICatalogueInteractor
    interactor = {
      updateArticles: jest.fn().mockResolvedValue(undefined),
      createArticle: jest.fn(),
      getArticle: jest.fn(),
    } as unknown as ICatalogueInteractor;

    logger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as Logger;

    handler = new UpdateArticlesHandler(interactor, logger);
  });

  describe('handleMessage', () => {
    it('should call updateArticles with parsed items', async () => {
      const message = JSON.stringify([{ id: 1, name: 'item1' }]);

      await handler.handleMessage(message);

      expect(interactor.updateArticles).toHaveBeenCalledWith([{ id: 1, name: 'item1' }]);
    });

    it('should log an error if updateArticles throws an exception', async () => {
      const message = JSON.stringify([{ id: 1, name: 'item1' }]);
      const error = new Error('Failed to update');
      (interactor.updateArticles as jest.Mock).mockRejectedValue(error);

      await handler.handleMessage(message);

      expect(logger.error).toHaveBeenCalledWith(
        'Error updating articles: Failed to update'
      );
    });

    it('should log a default error message if updateArticles throws an error without a message', async () => {
      const message = JSON.stringify([{ id: 1, name: 'item1' }]);
      const error = {};
      (interactor.updateArticles as jest.Mock).mockRejectedValue(error);

      await handler.handleMessage(message);

      expect(logger.error).toHaveBeenCalledWith(
        'Error updating articles: An error occurred'
      );
    });
  });
});
