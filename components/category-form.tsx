'use client';

import { useState, useEffect } from 'react';
import { useMoneySaver } from '@/hooks/use-money-saver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryFormProps {
  category?: { name: string; type: 'income' | 'expense' } | null;
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense';
}

export default function CategoryForm({ 
  category, 
  isOpen, 
  onClose,
  defaultType = 'expense'
}: CategoryFormProps) {
  const { settings, updateSettings } = useMoneySaver();
  const isEditing = !!category;
  
  // Get categories from settings
  const incomeCategories = settings.incomeCategories || ['Salary', 'Other Income'];
  const expenseCategories = settings.expenseCategories || ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Other'];
  
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>(defaultType);
  const [categoryName, setCategoryName] = useState('');
  
  // Reset form when category changes or form opens
  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setActiveTab(category.type);
    } else {
      setCategoryName('');
      setActiveTab(defaultType);
    }
  }, [category, isOpen, defaultType]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    // Check if the category already exists
    const existingCategories = activeTab === 'income' ? incomeCategories : expenseCategories;
    if (!isEditing && existingCategories.includes(categoryName)) {
      alert(`A category with the name "${categoryName}" already exists`);
      return;
    }
    
    // Update the categories
    if (isEditing && category) {
      // If we're editing, remove the old category and add the new one
      const updatedCategories = activeTab === 'income'
        ? incomeCategories.map(cat => cat === category.name ? categoryName : cat)
        : expenseCategories.map(cat => cat === category.name ? categoryName : cat);
      
      updateSettings({ 
        [activeTab === 'income' ? 'incomeCategories' : 'expenseCategories']: updatedCategories 
      });
    } else {
      // If we're adding, just append the new category
      const updatedCategories = activeTab === 'income'
        ? [...incomeCategories, categoryName]
        : [...expenseCategories, categoryName];
      
      updateSettings({ 
        [activeTab === 'income' ? 'incomeCategories' : 'expenseCategories']: updatedCategories 
      });
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {!isEditing && (
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'income' | 'expense')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expense</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Groceries"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Create'} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
