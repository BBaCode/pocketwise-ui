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
    account_type: 'Checking',
  },
  {
    id: '2',
    name: 'Savings Account',
    balance: '5000.00',
    'balance-date': Date.now(),
    'available-balance': '5000.00',
    org: { name: 'Global Savings Bank' },
    transactions: [], // Can fill in mock transactions
    account_type: 'Savings',
  },
  {
    id: '3',
    name: 'Chase Sapphire',
    balance: '-1022.32',
    'balance-date': Date.now(),
    'available-balance': '-1022.32',
    org: { name: 'JPMorgan Chase' },
    transactions: [], // Can fill in mock transactions
    account_type: 'Credit Card',
  },
];
