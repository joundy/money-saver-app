'use client';

import React, { createContext, useContext, useState } from 'react';
import CategoryForm from './category-form';

interface CategoryFormContextType {
  openCategoryForm: (type?: 'income' | 'expense') => void;
  closeCategoryForm: () => void;
}

const CategoryFormContext = createContext<CategoryFormContextType | undefined>(undefined);

export function useCategoryForm() {
  const context = useContext(CategoryFormContext);
  if (!context) {
    throw new Error('useCategoryForm must be used within a CategoryFormProvider');
  }
  return context;
}

export function CategoryFormProvider({ children }: { children: React.ReactNode }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ name: string; type: 'income' | 'expense' } | null>(null);
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');

  const openCategoryForm = (type?: 'income' | 'expense') => {
    setCategoryType(type || 'expense');
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const closeCategoryForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <CategoryFormContext.Provider value={{ openCategoryForm, closeCategoryForm }}>
      {children}
      <CategoryForm 
        isOpen={isFormOpen} 
        onClose={closeCategoryForm}
        defaultType={categoryType}
      />
    </CategoryFormContext.Provider>
  );
}
