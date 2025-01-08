export interface Transaction {
  id: string;
  account_id: string;
  posted: number;
  amount: string;
  description: string;
  payee: string;
  memo: string;
  transacted_at: number;
  category: string;
}

export interface TransactionToUpdate {
  id: string;
  category: string;
}

export interface Account {
  id: string;
  name: string;
  balance: string;
  'balance-date': number;
  'available-balance': string;
  org: Org;
  transactions: Transaction[];
  account_type: string;
}

interface Org {
  name: string;
}

export interface DataStore {
  accounts: Array<Account> | null;
  transactions: Array<Transaction> | null;
}
