'use client';

import React, { createContext, useContext, useState } from 'react';
import { Transaction } from '@/lib/storage';
import TransactionForm from './transaction-form';

interface TransactionFormContextType {
  openTransactionForm: (type?: 'income' | 'expense' | 'transfer', transaction?: Transaction) => void;
  closeTransactionForm: () => void;
}

const TransactionFormContext = createContext<TransactionFormContextType | undefined>(undefined);

export function useTransactionForm() {
  const context = useContext(TransactionFormContext);
  if (!context) {
    throw new Error('useTransactionForm must be used within a TransactionFormProvider');
  }
  return context;
}

export function TransactionFormProvider({ children }: { children: React.ReactNode }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'transfer'>('expense');

  const openTransactionForm = (type?: 'income' | 'expense' | 'transfer', transaction?: Transaction) => {
    setTransactionType(type || 'expense'); // Default to expense if no type provided
    setEditingTransaction(transaction || null);
    setIsFormOpen(true);
  };

  const closeTransactionForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  return (
    <TransactionFormContext.Provider value={{ openTransactionForm, closeTransactionForm }}>
      {children}
      <TransactionForm 
        transaction={editingTransaction || undefined} 
        isOpen={isFormOpen} 
        onClose={closeTransactionForm}
        defaultType={transactionType}
      />
    </TransactionFormContext.Provider>
  );
}
