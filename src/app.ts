import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import catalogueRouter from './routes/catalogue';
import './broker';
import { Logger } from './infrastructure/logging/Logger';
import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';

const logger = Logger.getInstance();
const app = new Koa();
const router = new Router();
const port = process.env.CATALOG_PORT || 3000;
const spec = yamljs.load('./openapi.yaml');

app.use(cors(
   {
        origin: "*", // Autorise toutes les origines (peut être remplacé par ton frontend "http://127.0.0.1:5173")
        allowMethods: ["GET", "POST", "DELETE", "OPTIONS"], // Autorise les méthodes nécessaires
        allowHeaders: ["Authorization", "Content-Type"], // Autorise les headers nécessaires
        credentials: true, // Permet d'envoyer les cookies ou tokens (si besoin)
   }
));
app.use(bodyParser());
router.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

router.get('/api/health', (ctx: Koa.Context) => {
  ctx.status = 200;
  ctx.body = { message: 'Welcome to BreizhSport Catalogue Services' };
});

app.use(router.routes());
app.use(catalogueRouter.routes());

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
