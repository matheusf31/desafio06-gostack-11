import { Router } from 'express';
import transactionsRouter from './transaction.routes';

const routes = Router();

/**
 * Sempre que a rota começar com /transaction
 * transactionsRouter será chamado e lá
 * ele dará continuidade à chamada
 */
routes.use('/transactions', transactionsRouter);

export default routes;
