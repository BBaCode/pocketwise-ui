import { Account } from '../models/account.model';

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'Checking Account',
    balance: '1500.00',
    'balance-date': Date.now(),
    'available-balance': '1500.00',
    org: { name: 'Bank of the World' },
    transactions: [], // Can fill in mock transactions
    type: 'Checking',
  },
  {
    id: '2',
    name: 'Savings Account',
    balance: '5000.00',
    'balance-date': Date.now(),
    'available-balance': '5000.00',
    org: { name: 'Global Savings' },
    transactions: [], // Can fill in mock transactions
    type: 'Savings',
  },
];
