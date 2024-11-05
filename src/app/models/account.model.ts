export interface Transaction {
  id: string;
  posted: number;
  amount: string;
  description: string;
  payee: string;
  memo: string;
  'transacted-at': number;
}

export interface Account {
  id: string;
  name: string;
  balance: string;
  'balance-date': number;
  'available-balance': string;
  transactions: Transaction[];
}
