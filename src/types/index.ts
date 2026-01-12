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
  currentBalance: number;
  monthlyIncome?: number;
  fixedExpenses?: number;
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

export interface GoogleAuthResponse {
  token: string | null;
  user?: User;
  email?: string;
  name?: string;
  photo?: string;
  isNewUser?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
