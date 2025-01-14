export interface BudgetRequest {
  year: number;
  month: number;
  amount: number;
}

export interface Budget {
  id: number;
  user_id: string;
  year: number;
  month: number;
  amount: number;
  created_at: string;
  last_updated: string;
}
