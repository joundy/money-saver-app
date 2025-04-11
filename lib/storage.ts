/**
 * Storage utilities for Money Saver App
 * Handles saving and loading data from local storage
 */

import { useEffect, useState } from 'react';

// Type definitions based on the data structure in PRD
export interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  accountId: string;
  fromAccountId?: string; // For transfer transactions
  toAccountId?: string; // For transfer transactions
  category: string;
  description?: string;
  date: string;
}

export interface Settings {
  currency: string;
  dateFormat: string;
  incomeCategories: string[];
  expenseCategories: string[];
  accountTypes: string[];
  defaultIncomeCategory?: string;
  defaultExpenseCategory?: string;
}

export interface AppData {
  accounts: Account[];
  transactions: Transaction[];
  settings: Settings;
}

// Default initial data
export const DEFAULT_DATA: AppData = {
  accounts: [
    {
      id: 'acc-1',
      name: 'Cash',
      balance: 0,
      type: 'cash',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'acc-2',
      name: 'Bank Account',
      balance: 0,
      type: 'bank',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'acc-3',
      name: 'Credit Card',
      balance: 0,
      type: 'credit',
      createdAt: new Date().toISOString(),
    },
  ],
  transactions: [],
  settings: {
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    incomeCategories: ['Salary', 'Other Income'],
    expenseCategories: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Other'],
    accountTypes: ['Cash', 'Bank', 'Credit Card', 'Investment', 'Digital Wallet'],
    defaultIncomeCategory: 'Salary',
    defaultExpenseCategory: 'Food',
  },
};

// Storage keys
const STORAGE_KEY = 'moneySaverData';

/**
 * Save data to local storage
 * @param data The app data to save
 */
export const saveData = (data: AppData): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  }
};

/**
 * Load data from local storage
 * @returns The app data from local storage or default data if none exists
 */
export const loadData = (): AppData => {
  if (typeof window !== 'undefined') {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData) as AppData;
      }
    } catch (error) {
      console.error('Error loading data from local storage:', error);
    }
  }
  return DEFAULT_DATA;
};

/**
 * Hook to load data from local storage on component mount
 * @returns The app data from local storage
 */
export const useLoadData = (): AppData => {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  
  useEffect(() => {
    setData(loadData());
  }, []);
  
  return data;
};

/**
 * Generate a unique ID for new accounts or transactions
 * @param prefix Prefix for the ID ('acc' for accounts, 'tx' for transactions)
 * @returns A unique ID string
 */
export const generateId = (prefix: 'acc' | 'tx'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
