import { IApiResponse } from '../../../infrastructure/api-response/interfaces/IApiResponse';
import { UpdateArticlesResponse, UpdateItem } from '../../../types/catalogue';
import { Article } from '../entity/Article';

export interface ICatalogueInteractor {
  createArticle(body: Article): Promise<IApiResponse>;
  getArticles(limit: number, offset: number): Promise<IApiResponse>;
  updateArticles(items: UpdateItem[]): Promise<UpdateArticlesResponse>;
}
