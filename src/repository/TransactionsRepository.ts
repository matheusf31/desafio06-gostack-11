import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;

          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;

          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total: number = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public async findFormated(): Promise<Transaction[]> {
    const transactions = await this.createQueryBuilder('transactions')
      .leftJoinAndSelect('transactions.category', 'category')
      .select([
        'transactions.id',
        'transactions.title',
        'transactions.value',
        'transactions.type',
        'category.id',
        'category.title',
      ])
      .getMany();

    return transactions;
  }
}

export default TransactionsRepository;
