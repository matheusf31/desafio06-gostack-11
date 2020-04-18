/**
 * Não tem responsabilidade pelo formato dos dados e nem pela maneira como eles são armazenados
 * Receber a requisição, chamar outro arquivo e devolver uma resposta
 */

import { Router } from 'express';

import TransactionsRepository from '../repository/TransactionsRepository';
import CreateTransactionsService from '../service/CreateTransactionService';

const transactionsRouter = Router();
const transactionRepository = new TransactionsRepository();

transactionsRouter.post('/', (req, res) => {
  try {
    const { title, value, type } = req.body;

    /**
     * Transformação de dado !== Regra de negócio
     */

    const createTransaction = new CreateTransactionsService(
      transactionRepository,
    );

    const transaction = createTransaction.execute({ title, value, type });

    return res.json(transaction);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

transactionsRouter.get('/', (req, res) => {
  try {
    const transactions = transactionRepository.all();
    const balance = transactionRepository.getBalance();

    return res.json({
      transactions,
      balance,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

export default transactionsRouter;
