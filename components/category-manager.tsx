'use client';

import { useMoneySaver } from '@/hooks/use-money-saver';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Trash2 } from 'lucide-react';
import AddCategoryButton from './add-category-button';
import { useCategoryForm } from './category-form-provider';

export default function CategoryManager() {
  const { 
    settings,
    updateSettings
  } = useMoneySaver();
  
  const { openCategoryForm } = useCategoryForm();
  
  // Get categories and defaults from settings
  const incomeCategories = settings.incomeCategories || ['Salary', 'Other Income'];
  const expenseCategories = settings.expenseCategories || ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Other'];
  const defaultIncomeCategory = settings.defaultIncomeCategory;
  const defaultExpenseCategory = settings.defaultExpenseCategory;

  // Function to delete a category
  const handleDeleteCategory = (name: string, type: 'income' | 'expense') => {
    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      // Check if it's the default category
      const isDefault = (type === 'income' && defaultIncomeCategory === name) || 
                      (type === 'expense' && defaultExpenseCategory === name);
      
      if (type === 'income') {
        const updatedCategories = incomeCategories.filter(cat => cat !== name);
        const updateData: Partial<typeof settings> = { incomeCategories: updatedCategories };
        
        // If we're deleting the default category, remove the default
        if (isDefault) {
          updateData.defaultIncomeCategory = undefined;
        }
        
        updateSettings(updateData);
      } else {
        const updatedCategories = expenseCategories.filter(cat => cat !== name);
        const updateData: Partial<typeof settings> = { expenseCategories: updatedCategories };
        
        // If we're deleting the default category, remove the default
        if (isDefault) {
          updateData.defaultExpenseCategory = undefined;
        }
        
        updateSettings(updateData);
      }
    }
  };
  
  // Function to set a category as default
  const setAsDefault = (name: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      updateSettings({ defaultIncomeCategory: name });
    } else {
      updateSettings({ defaultExpenseCategory: name });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your income and expense categories</CardDescription>
        </div>
        <AddCategoryButton 
          onAddCategory={openCategoryForm}
          variant="outline"
          size="sm"
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expense">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>
          <TabsContent value="income" className="mt-4">              
            <div className="space-y-2">
              {incomeCategories.map(category => (
                <div key={category} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{category}</span>
                    {defaultIncomeCategory === category && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {defaultIncomeCategory !== category && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setAsDefault(category, 'income')}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openCategoryForm('income')}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteCategory(category, 'income')}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
              
              {incomeCategories.length === 0 && (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No income categories yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="expense" className="mt-4">              
            <div className="space-y-2">
              {expenseCategories.map(category => (
                <div key={category} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{category}</span>
                    {defaultExpenseCategory === category && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {defaultExpenseCategory !== category && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setAsDefault(category, 'expense')}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openCategoryForm('expense')}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteCategory(category, 'expense')}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
              
              {expenseCategories.length === 0 && (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No expense categories yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
