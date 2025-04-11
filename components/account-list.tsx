'use client';

import { useMoneySaver } from '@/hooks/use-money-saver';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Account } from '@/lib/storage';

export default function AccountList() {
  const { 
    accounts, 
    getTotalBalance,
    deleteAccount
  } = useMoneySaver();
  
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // Function to handle account deletion
  const handleDeleteAccount = (accountId: string) => {
    if (confirm('Are you sure you want to delete this account? All associated transactions will also be deleted.')) {
      deleteAccount(accountId);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>Manage your financial accounts</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Add Account</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-lg font-semibold">Total Balance: ${getTotalBalance().toFixed(2)}</p>
        </div>
        
        <div className="space-y-3">
          {accounts.map(account => (
            <div key={account.id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{account.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{account.type}</p>
                </div>
                <p className={`text-xl font-semibold ${account.balance < 0 ? 'text-red-500' : ''}`}>
                  ${account.balance.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2 mt-3 justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setEditingAccount(account)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleDeleteAccount(account.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {accounts.length === 0 && (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No accounts yet. Add your first account to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
