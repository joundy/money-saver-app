'use client';

/**
 * Custom hook for Money Saver App
 * Provides easy access to account and transaction operations
 */

import { useAppContext } from '@/lib/context';
import { Account, Transaction } from '@/lib/storage';

export function useMoneySaver() {
  const { 
    data, 
    addAccount, 
    updateAccount, 
    deleteAccount, 
    addTransaction, 
    updateTransaction,
    deleteTransaction,
    updateSettings
  } = useAppContext();

  // Accounts related functions
  const accounts = data.accounts;
  
  const getAccountById = (accountId: string) => {
    return accounts.find(account => account.id === accountId);
  };
  
  const getTotalBalance = () => {
    return accounts.reduce((total, account) => {
      // For credit accounts, we subtract the balance as it represents debt
      const balanceToAdd = account.type === 'credit' ? -account.balance : account.balance;
      return total + balanceToAdd;
    }, 0);
  };
  
  // Transactions related functions
  const transactions = data.transactions;
  
  const getTransactionsByAccount = (accountId: string) => {
    return transactions.filter(transaction => 
      transaction.accountId === accountId || 
      transaction.fromAccountId === accountId || 
      transaction.toAccountId === accountId
    );
  };
  
  const getTransactionsByType = (type: Transaction['type']) => {
    return transactions.filter(transaction => transaction.type === type);
  };
  
  const getTransactionsByDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return transactions.filter(transaction => 
      transaction.date.split('T')[0] === dateString
    );
  };
  
  const getTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date).getTime();
      return transactionDate >= start && transactionDate <= end;
    });
  };
  
  const getDailyTransactionSummary = (date: Date) => {
    const dailyTransactions = getTransactionsByDate(date);
    
    const incomeTotal = dailyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenseTotal = dailyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      incomeTotal,
      expenseTotal,
      netChange: incomeTotal - expenseTotal,
      transactions: dailyTransactions
    };
  };
  
  // Settings
  const settings = data.settings;
  
  return {
    // Data
    accounts,
    transactions,
    settings,
    
    // Account operations
    addAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    getTotalBalance,
    
    // Transaction operations
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByAccount,
    getTransactionsByType,
    getTransactionsByDate,
    getTransactionsByDateRange,
    getDailyTransactionSummary,
    
    // Settings operations
    updateSettings
  };
}
