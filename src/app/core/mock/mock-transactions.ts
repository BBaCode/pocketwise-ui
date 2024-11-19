import { Transaction } from '../models/account.model';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    accountId: '1',
    posted: Date.now() - 86400000, // 1 day ago
    amount: '-50.00',
    description: 'Grocery Store',
    payee: 'Local Grocery',
    memo: 'Weekly groceries',
    transacted_at: Date.now() - 86400000,
    category: 'Food & Dining',
  },
  {
    id: 't2',
    accountId: '1',
    posted: Date.now() - 172800000, // 2 days ago
    amount: '-25.00',
    description: 'Coffee Shop',
    payee: 'Daily Brew',
    memo: 'Morning coffee',
    transacted_at: Date.now() - 172800000,
    category: 'Food & Dining',
  },
  {
    id: 't1',
    accountId: '1',
    posted: Date.now() - 86400000, // 1 day ago
    amount: '-50.00',
    description: 'Grocery Store',
    payee: 'Local Grocery',
    memo: 'Weekly groceries',
    transacted_at: Date.now() - 86400000,
    category: 'Food & Dining',
  },
  {
    id: 't3',
    accountId: '3',
    posted: Date.now() - 172800000, // 2 days ago
    amount: '-25.00',
    description: 'Coffee Shop',
    payee: 'MBTA',
    memo: 'Morning coffee',
    transacted_at: Date.now() - 172800000,
    category: 'Transportation',
  },
];
