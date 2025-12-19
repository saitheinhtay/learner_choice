
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
}

export interface WorkflowTask {
  id: string;
  title: string;
  type: 'PAYOUT' | 'COURSE_REVIEW' | 'STUDENT_SUPPORT' | 'KYC_VERIFICATION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: TaskStatus;
  assignedTo?: string;
  createdAt: string;
  description: string;
  user: string;
}

export interface PlatformConfig {
  referralPercentage: number;
  minWithdrawalUSD: number;
  qrPayCommissionRate: number;
  cryptoGasSubsidy: boolean;
  kycRequired: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  balance: number;
  bankLinked: boolean;
  qrPayLinked: boolean;
  cryptoAddress?: string;
  learningPoints: number;
  stakedPoints: number;
  savingsGoals: SavingsGoal[];
  referralCode?: string;
  totalReferralEarnings: number;
  isVerified: boolean;
  joinedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  rewardPoints: number;
  rewardCash: number;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  price: number;
  rewardPool: number;
  category: string;
  thumbnail: string;
  description: string;
  modules?: Module[];
}

export interface Transaction {
  id: string;
  type: 'EARNING' | 'WITHDRAWAL' | 'REWARD' | 'STAKING' | 'GOAL_ALLOCATION' | 'SCHOLARSHIP' | 'REFERRAL';
  method: 'QRPAY' | 'CRYPTO' | 'BANK' | 'INTERNAL';
  amount: number;
  date: string;
  description: string;
  status: 'COMPLETED' | 'PENDING';
}

export interface ClassSession {
  id: string;
  title: string;
  teacher: string;
  startTime: string;
  duration: string;
  studentCount: number;
  isLive: boolean;
  reward: number;
}

// Added missing interfaces for the eLibrary feature
export interface BookChapter {
  id: string;
  title: string;
  content: string;
}

export interface EBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  description: string;
  rewardPerChapter: number;
  chapters: BookChapter[];
}
