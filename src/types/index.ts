export type TransactionType = "INCOME" | "EXPENSE";

export type Frequency =
  | "UNIQUE"
  | "WEEKLY"
  | "MONTHLY"
  | "TRIMESTERLY"
  | "SEMESTERLY"
  | "ANNUAL";

export interface User {
  id: string;
  email: string;
  name: string;
  currentBalance: string;
  monthlyIncome?: string;
  fixedExpenses?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: string;
  category: string;
  type: TransactionType;
  frequency: Frequency;
  date: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetAmount: string;
  currentAmount?: string;
}

export interface ChatMessage {
  userId: string;
  message: string;
}

export interface ChatResponse {
  response: string;
}
