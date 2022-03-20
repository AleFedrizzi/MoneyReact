import { createContext, useEffect, useState, ReactNode, useContext } from 'react'
import { api } from '../services/api';

interface Transaction{
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

type TransactioInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProvideProps{
  children: ReactNode; 
}

interface TransactionsContextData{
  transactions: Transaction[];
  createTransaction: (transaction: TransactioInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransactionsProvide({children} : TransactionsProvideProps) {
  const [transactions, settransactions] = useState<Transaction[]>([]);

  useEffect(() =>{
    api.get('transactions')
    .then(Response => settransactions(Response.data.transactions))
  }, []);

  async function createTransaction(transactionInput: TransactioInput){

    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date(),
    })
    const { transaction } = response.data;

    settransactions([
      ...transactions,
      transaction,
    ]);
  }

  return(
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions (){
  const context = useContext(TransactionsContext);

  return context;
}