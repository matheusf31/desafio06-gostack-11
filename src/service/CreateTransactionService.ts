import Transaction from '../model/Transaction';
import TransactionRepository from '../repository/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

// Não tem acesso às variáveis de requisição e resposta
// Toda lógica da criação de agendamento
class CreateTransacrionService {
  private transactionsRepository: TransactionRepository;

  // Receber dependências através do constructor
  // transactionRepository será uma instância de TransactionRepository
  constructor(transactionsRepository: TransactionRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestDTO): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction type is invalid');
    }

    const { total } = this.transactionsRepository.getBalance();

    // regra de negocio
    if (type === 'outcome' && value > total) {
      throw Error(
        'The value goes beyond the total amount the user has in cash',
      );
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransacrionService;
