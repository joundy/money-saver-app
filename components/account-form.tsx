'use client';

import { useState, useEffect } from 'react';
import { useMoneySaver } from '@/hooks/use-money-saver';
import { Account } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface AccountFormProps {
  account?: Account;
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountForm({ account, isOpen, onClose }: AccountFormProps) {
  const { addAccount, updateAccount, settings } = useMoneySaver();
  const isEditing = !!account;
  
  // Get account types from settings
  const accountTypes = settings.accountTypes || ['Cash', 'Bank', 'Credit Card'];

  const [formData, setFormData] = useState({
    name: '',
    balance: 0,
    type: accountTypes[0] || 'Cash'
  });

  // Reset form when account changes
  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        balance: account.balance,
        type: account.type
      });
    } else {
      setFormData({
        name: '',
        balance: 0,
        type: 'cash'
      });
    }
  }, [account, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter an account name');
      return;
    }

    if (isEditing && account) {
      updateAccount({
        ...account,
        name: formData.name,
        balance: formData.balance,
        type: formData.type
      });
    } else {
      addAccount({
        name: formData.name,
        balance: formData.balance,
        type: formData.type
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Account' : 'Add New Account'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., My Checking Account"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance</Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup 
              value={formData.type} 
              onValueChange={handleTypeChange}
              className="flex flex-col space-y-1"
            >
              {accountTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={type.toLowerCase().replace(/\s+/g, '-')} />
                  <Label htmlFor={type.toLowerCase().replace(/\s+/g, '-')}>{type}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Create'} Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
