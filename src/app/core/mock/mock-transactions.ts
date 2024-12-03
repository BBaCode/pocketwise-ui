import { Transaction } from '../models/account.model';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    account_id: '1',
    posted: Date.now() - 86400000, // 1 day ago
    amount: '-50.00',
    description: 'Grocery Store',
    payee: 'Local Grocery',
    memo: 'Weekly groceries',
    transacted_at: Date.now() - 86400000,
    category: 'Groceries',
  },
  {
    id: 't2',
    account_id: '1',
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
    account_id: '1',
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
    account_id: '3',
    posted: Date.now() - 172800000, // 2 days ago
    amount: '-25.00',
    description: 'Coffee Shop',
    payee: 'MBTA',
    memo: 'Morning coffee',
    transacted_at: Date.now() - 172800000,
    category: 'Transportation',
  },
  {
    id: 't4',
    account_id: '3',
    posted: Date.now() - 172800000, // 2 days ago
    amount: '-225.00',
    description: 'LifeTime Fitness',
    payee: 'LifeTime Fitness',
    memo: 'Gym Membership',
    transacted_at: Date.now() - 172800000,
    category: 'Health & Wellness',
  },
];
