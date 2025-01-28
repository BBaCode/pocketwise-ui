export interface BudgetRequest {
  year: number;
  month: number;
  total: number;
  food: number;
  groceries: number;
  transportation: number;
  entertainment: number;
  health: number;
  shopping: number;
  utilities: number;
  housing: number;
  travel: number;
  education: number;
  subscriptions: number;
  gifts: number;
  insurance: number;
  personal_care: number;
  other: number;
  unknown: number;
}

export interface Budget {
  id: number;
  user_id: string;
  year: number;
  month: number;
  total: number;
  food: number;
  groceries: number;
  transportation: number;
  entertainment: number;
  health: number;
  shopping: number;
  utilities: number;
  housing: number;
  travel: number;
  education: number;
  subscriptions: number;
  gifts: number;
  insurance: number;
  personal_care: number;
  other: number;
  unknown: number;
  created_at: string;
  last_updated: string;
}
