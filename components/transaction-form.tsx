'use client';

import { useState, useEffect } from 'react';
import { useMoneySaver } from '@/hooks/use-money-saver';
import { Transaction } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TransactionFormProps {
  transaction?: Transaction;
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense' | 'transfer';
}

export default function TransactionForm({ 
  transaction, 
  isOpen, 
  onClose,
  defaultType = 'expense'
}: TransactionFormProps) {
  const { accounts, settings, addTransaction, updateTransaction } = useMoneySaver();
  const isEditing = !!transaction;
  
  // Get categories and defaults from settings
  const incomeCategories = settings.incomeCategories || ['Salary', 'Other Income'];
  const expenseCategories = settings.expenseCategories || ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Other'];
  const defaultIncomeCategory = settings.defaultIncomeCategory;
  const defaultExpenseCategory = settings.defaultExpenseCategory;

  const [activeTab, setActiveTab] = useState<'income' | 'expense' | 'transfer'>(defaultType);
  
  const [formData, setFormData] = useState({
    // Common fields
    amount: 0,
    description: '',
    
    // Income & Expense fields
    accountId: '',
    category: '',
    
    // Transfer fields
    fromAccountId: '',
    toAccountId: '',
  });

  // Reset form when transaction changes or form opens
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        description: transaction.description || '',
        accountId: transaction.accountId || '',
        category: transaction.category || '',
        fromAccountId: transaction.fromAccountId || '',
        toAccountId: transaction.toAccountId || '',
      });
      
      setActiveTab(transaction.type);
    } else {
      // Set the active tab first
      setActiveTab(defaultType);
      
      // Then set default values for new transaction based on the active tab
      const defaultCategory = defaultType === 'income'
        ? (defaultIncomeCategory || incomeCategories[0] || '')
        : (defaultExpenseCategory || expenseCategories[0] || '');
        
      setFormData({
        amount: 0,
        description: '',
        accountId: accounts.length > 0 ? accounts[0].id : '',
        category: defaultCategory,
        fromAccountId: accounts.length > 0 ? accounts[0].id : '',
        toAccountId: accounts.length > 1 ? accounts[1].id : (accounts.length > 0 ? accounts[0].id : ''),
      });
    }
  }, [transaction, isOpen, accounts, defaultType, defaultIncomeCategory, defaultExpenseCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Update category when tab changes
  useEffect(() => {
    if (!transaction && isOpen) {
      // Only update category when creating a new transaction
      let defaultCategory = '';
      
      if (activeTab === 'income') {
        defaultCategory = defaultIncomeCategory || incomeCategories[0] || '';
        console.log('Setting income default category:', defaultCategory);
      } else if (activeTab === 'expense') {
        defaultCategory = defaultExpenseCategory || expenseCategories[0] || '';
        console.log('Setting expense default category:', defaultCategory);
      }
      
      // Force update with a small delay to ensure the UI has updated
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          category: defaultCategory
        }));
      }, 50);
    }
  }, [activeTab, defaultIncomeCategory, defaultExpenseCategory, incomeCategories, expenseCategories, transaction, isOpen]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.amount <= 0) {
      alert('Amount must be greater than zero');
      return;
    }

    // Validate based on transaction type
    if (activeTab === 'income' || activeTab === 'expense') {
      if (!formData.accountId) {
        alert('Please select an account');
        return;
      }
      if (!formData.category) {
        alert('Please select a category');
        return;
      }
    } else if (activeTab === 'transfer') {
      if (!formData.fromAccountId || !formData.toAccountId) {
        alert('Please select both source and destination accounts');
        return;
      }
      if (formData.fromAccountId === formData.toAccountId) {
        alert('Source and destination accounts must be different');
        return;
      }
    }

    // Create transaction object based on type
    let transactionData: Partial<Transaction> = {
      type: activeTab,
      amount: formData.amount,
      description: formData.description,
    };

    if (activeTab === 'income' || activeTab === 'expense') {
      transactionData.accountId = formData.accountId;
      transactionData.category = formData.category;
    } else if (activeTab === 'transfer') {
      transactionData.fromAccountId = formData.fromAccountId;
      transactionData.toAccountId = formData.toAccountId;
      // For transfers, we still need an accountId for the transaction list
      transactionData.accountId = formData.fromAccountId;
      transactionData.category = 'Transfer';
    }

    if (isEditing && transaction) {
      updateTransaction({
        ...transaction,
        ...transactionData,
      } as Transaction);
    } else {
      addTransaction(transactionData as Omit<Transaction, 'id' | 'date'>);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {!isEditing && (
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => {
                const newType = value as 'income' | 'expense' | 'transfer';
                setActiveTab(newType);
                
                // Immediately update the category based on the new tab
                if (newType === 'income') {
                  handleSelectChange('category', defaultIncomeCategory || incomeCategories[0] || '');
                } else if (newType === 'expense') {
                  handleSelectChange('category', defaultExpenseCategory || expenseCategories[0] || '');
                }
              }}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expense</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
          
          {(activeTab === 'income' || activeTab === 'expense') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="accountId">Account</Label>
                <Select 
                  value={formData.accountId} 
                  onValueChange={(value) => handleSelectChange('accountId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} (${account.balance.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                  defaultValue={activeTab === 'income' ? defaultIncomeCategory : defaultExpenseCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(activeTab === 'income' ? incomeCategories : expenseCategories).map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                        {((activeTab === 'income' && category === defaultIncomeCategory) || 
                          (activeTab === 'expense' && category === defaultExpenseCategory)) && 
                          ' (Default)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {activeTab === 'transfer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fromAccountId">From Account</Label>
                <Select 
                  value={formData.fromAccountId} 
                  onValueChange={(value) => handleSelectChange('fromAccountId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} (${account.balance.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toAccountId">To Account</Label>
                <Select 
                  value={formData.toAccountId} 
                  onValueChange={(value) => handleSelectChange('toAccountId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} (${account.balance.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a description"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Save'} Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
