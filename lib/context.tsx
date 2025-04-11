'use client';

/**
 * Context provider for Money Saver App
 * Manages global state and provides access to storage utilities
 */

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AppData, DEFAULT_DATA, saveData, loadData, Account, Transaction, generateId } from './storage';

// Action types
type ActionType = 
  | { type: 'INITIALIZE_DATA', payload: AppData }
  | { type: 'ADD_ACCOUNT', payload: Omit<Account, 'id' | 'createdAt'> }
  | { type: 'UPDATE_ACCOUNT', payload: Account }
  | { type: 'DELETE_ACCOUNT', payload: string }
  | { type: 'ADD_TRANSACTION', payload: Omit<Transaction, 'id' | 'date'> }
  | { type: 'UPDATE_TRANSACTION', payload: Transaction }
  | { type: 'DELETE_TRANSACTION', payload: string }
  | { type: 'UPDATE_SETTINGS', payload: Partial<AppData['settings']> };

// Context type
interface AppContextType {
  data: AppData;
  dispatch: React.Dispatch<ActionType>;
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (accountId: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: string) => void;
  updateSettings: (settings: Partial<AppData['settings']>) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer function
function appReducer(state: AppData, action: ActionType): AppData {
  switch (action.type) {
    case 'INITIALIZE_DATA':
      return action.payload;
      
    case 'ADD_ACCOUNT': {
      const newAccount: Account = {
        ...action.payload,
        id: generateId('acc'),
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        accounts: [...state.accounts, newAccount],
      };
    }
      
    case 'UPDATE_ACCOUNT': {
      return {
        ...state,
        accounts: state.accounts.map(account => 
          account.id === action.payload.id ? action.payload : account
        ),
      };
    }
      
    case 'DELETE_ACCOUNT': {
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload),
        // Also remove transactions associated with this account
        transactions: state.transactions.filter(transaction => 
          transaction.accountId !== action.payload &&
          transaction.fromAccountId !== action.payload &&
          transaction.toAccountId !== action.payload
        ),
      };
    }
      
    case 'ADD_TRANSACTION': {
      const newTransaction: Transaction = {
        ...action.payload,
        id: generateId('tx'),
        date: new Date().toISOString(),
      };
      
      // Update account balances based on transaction type
      let updatedAccounts = [...state.accounts];
      
      if (newTransaction.type === 'income') {
        // Add amount to the target account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === newTransaction.accountId) {
            return {
              ...account,
              balance: account.balance + newTransaction.amount,
            };
          }
          return account;
        });
      } 
      else if (newTransaction.type === 'expense') {
        // Subtract amount from the target account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === newTransaction.accountId) {
            return {
              ...account,
              balance: account.balance - newTransaction.amount,
            };
          }
          return account;
        });
      } 
      else if (newTransaction.type === 'transfer' && newTransaction.fromAccountId && newTransaction.toAccountId) {
        // Subtract from source account and add to destination account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === newTransaction.fromAccountId) {
            return {
              ...account,
              balance: account.balance - newTransaction.amount,
            };
          }
          if (account.id === newTransaction.toAccountId) {
            return {
              ...account,
              balance: account.balance + newTransaction.amount,
            };
          }
          return account;
        });
      }
      
      return {
        ...state,
        accounts: updatedAccounts,
        transactions: [...state.transactions, newTransaction],
      };
    }
      
    case 'UPDATE_TRANSACTION': {
      const oldTransaction = state.transactions.find(t => t.id === action.payload.id);
      
      if (!oldTransaction) {
        return state;
      }
      
      // First revert the effects of the old transaction
      let updatedAccounts = [...state.accounts];
      
      // Revert old transaction effects
      if (oldTransaction.type === 'income') {
        // Subtract amount from the target account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === oldTransaction.accountId) {
            return {
              ...account,
              balance: account.balance - oldTransaction.amount,
            };
          }
          return account;
        });
      } 
      else if (oldTransaction.type === 'expense') {
        // Add amount back to the target account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === oldTransaction.accountId) {
            return {
              ...account,
              balance: account.balance + oldTransaction.amount,
            };
          }
          return account;
        });
      } 
      else if (oldTransaction.type === 'transfer' && oldTransaction.fromAccountId && oldTransaction.toAccountId) {
        // Add back to source account and subtract from destination account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === oldTransaction.fromAccountId) {
            return {
              ...account,
              balance: account.balance + oldTransaction.amount,
            };
          }
          if (account.id === oldTransaction.toAccountId) {
            return {
              ...account,
              balance: account.balance - oldTransaction.amount,
            };
          }
          return account;
        });
      }
      
      // Then apply the effects of the new transaction
      const newTransaction = action.payload;
      
      if (newTransaction.type === 'income') {
        // Add amount to the target account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === newTransaction.accountId) {
            return {
              ...account,
              balance: account.balance + newTransaction.amount,
            };
          }
          return account;
        });
      } 
      else if (newTransaction.type === 'expense') {
        // Subtract amount from the target account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === newTransaction.accountId) {
            return {
              ...account,
              balance: account.balance - newTransaction.amount,
            };
          }
          return account;
        });
      } 
      else if (newTransaction.type === 'transfer' && newTransaction.fromAccountId && newTransaction.toAccountId) {
        // Subtract from source account and add to destination account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === newTransaction.fromAccountId) {
            return {
              ...account,
              balance: account.balance - newTransaction.amount,
            };
          }
          if (account.id === newTransaction.toAccountId) {
            return {
              ...account,
              balance: account.balance + newTransaction.amount,
            };
          }
          return account;
        });
      }
      
      return {
        ...state,
        accounts: updatedAccounts,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        ),
      };
    }
      
    case 'DELETE_TRANSACTION': {
      const transactionToDelete = state.transactions.find(t => t.id === action.payload);
      
      if (!transactionToDelete) {
        return state;
      }
      
      // Revert account balances based on transaction type
      let updatedAccounts = [...state.accounts];
      
      if (transactionToDelete.type === 'income') {
        // Subtract amount from the target account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === transactionToDelete.accountId) {
            return {
              ...account,
              balance: account.balance - transactionToDelete.amount,
            };
          }
          return account;
        });
      } 
      else if (transactionToDelete.type === 'expense') {
        // Add amount back to the target account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === transactionToDelete.accountId) {
            return {
              ...account,
              balance: account.balance + transactionToDelete.amount,
            };
          }
          return account;
        });
      } 
      else if (transactionToDelete.type === 'transfer' && transactionToDelete.fromAccountId && transactionToDelete.toAccountId) {
        // Add back to source account and subtract from destination account
        updatedAccounts = updatedAccounts.map(account => {
          if (account.id === transactionToDelete.fromAccountId) {
            return {
              ...account,
              balance: account.balance + transactionToDelete.amount,
            };
          }
          if (account.id === transactionToDelete.toAccountId) {
            return {
              ...account,
              balance: account.balance - transactionToDelete.amount,
            };
          }
          return account;
        });
      }
      
      return {
        ...state,
        accounts: updatedAccounts,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    }
      
    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    }
      
    default:
      return state;
  }
}

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, dispatch] = useReducer(appReducer, DEFAULT_DATA);
  
  // Load data from local storage on initial render
  useEffect(() => {
    const storedData = loadData();
    dispatch({ type: 'INITIALIZE_DATA', payload: storedData });
  }, []);
  
  // Save data to local storage whenever it changes
  useEffect(() => {
    saveData(data);
  }, [data]);
  
  // Helper functions to dispatch actions
  const addAccount = (account: Omit<Account, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_ACCOUNT', payload: account });
  };
  
  const updateAccount = (account: Account) => {
    dispatch({ type: 'UPDATE_ACCOUNT', payload: account });
  };
  
  const deleteAccount = (accountId: string) => {
    dispatch({ type: 'DELETE_ACCOUNT', payload: accountId });
  };
  
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };
  
  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };
  
  const deleteTransaction = (transactionId: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: transactionId });
  };
  
  const updateSettings = (settings: Partial<AppData['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };
  
  return (
    <AppContext.Provider value={{ 
      data, 
      dispatch,
      addAccount,
      updateAccount,
      deleteAccount,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
