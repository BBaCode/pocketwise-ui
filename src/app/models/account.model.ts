export interface Transaction {
  id: string;
  accountId: string;
  posted: number;
  amount: string;
  description: string;
  payee: string;
  memo: string;
  'transacted-at': number;
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
  type?: string;
}

interface Org {
  name: string;
}

export interface DataStore {
  accounts: Array<Account>;
  transactions: Array<Transaction>;
}
