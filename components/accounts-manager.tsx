'use client';

import { useState } from 'react';
import { useMoneySaver } from '@/hooks/use-money-saver';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Account } from '@/lib/storage';
import AccountForm from './account-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountTypesManager from './account-types-manager';

export default function AccountsManager() {
  const { 
    accounts, 
    getTotalBalance,
    deleteAccount
  } = useMoneySaver();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // Function to handle account deletion
  const handleDeleteAccount = (accountId: string) => {
    if (confirm('Are you sure you want to delete this account? All associated transactions will also be deleted.')) {
      deleteAccount(accountId);
    }
  };

  // Function to open the form for adding a new account
  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsFormOpen(true);
  };

  // Function to open the form for editing an existing account
  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  // Function to close the form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAccount(null);
  };

  return (
    <>
      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="types">Account Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="mt-6">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Accounts</CardTitle>
                <CardDescription>Manage your financial accounts</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleAddAccount}
              >
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
                        onClick={() => handleEditAccount(account)}
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
                
                {accounts.length === 0 && (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No accounts yet. Add your first account to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="types" className="mt-6">
          <AccountTypesManager />
        </TabsContent>
      </Tabs>

      <AccountForm 
        account={editingAccount || undefined} 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
      />
    </>
  );
}
