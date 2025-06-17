import { FindReturn, UpdateItem } from '../../../types/catalogue';
import { Article } from '../entity/Article';

export interface ICatalogueRepository {
  create(data: Article): Promise<Article>;
  findAll(limit: number, offset: number): Promise<FindReturn>;
  update(items: UpdateItem[]): Promise<Article[]>;
}
