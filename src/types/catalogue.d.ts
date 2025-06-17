import { Article } from '../features/catalogue/entity/Article';
import { IApiResponse } from '../infrastructure/api-response/interfaces/IApiResponse';

type FindReturn = {
  items: Article[];
  total: number;
};

type UpdateItem = {
  articleId: string;
  qteCmd: number;
};

type UpdateArticlesResponse = IApiResponse & {
  articles?: {
    articleId: string;
    qteCmd: number;
  }[];
};

type Order = {
	orderId: string;
	items: {
		articleId: string;
		qteCmd: number;
	}[];
};