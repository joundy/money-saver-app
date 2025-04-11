'use client';

import { useMoneySaver } from '@/hooks/use-money-saver';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientComponent() {
  const { 
    accounts, 
    transactions, 
    getTotalBalance,
    addAccount,
    addTransaction
  } = useMoneySaver();

  // Function to add a test account
  const handleAddTestAccount = () => {
    addAccount({
      name: 'Test Account',
      balance: 1000,
      type: 'bank'
    });
  };

  // Function to add a test transaction
  const handleAddTestTransaction = () => {
    if (accounts.length > 0) {
      addTransaction({
        type: 'income',
        amount: 500,
        accountId: accounts[0].id,
        category: 'salary',
        description: 'Test transaction'
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>Your financial accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-lg font-semibold">Total Balance: ${getTotalBalance().toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            {accounts.map(account => (
              <div key={account.id} className="p-3 border rounded-md">
                <p className="font-medium">{account.name}</p>
                <p className="text-sm text-muted-foreground">Type: {account.type}</p>
                <p className="text-sm">Balance: ${account.balance.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={handleAddTestAccount}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Test Account
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Your financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {transactions.length === 0 ? (
              <p className="text-muted-foreground">No transactions yet</p>
            ) : (
              transactions.map(transaction => (
                <div key={transaction.id} className="p-3 border rounded-md">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {transaction.type === 'income' ? '+ ' : transaction.type === 'expense' ? '- ' : ''}
                      ${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                  </div>
                  <p className="text-sm">{transaction.description || 'No description'}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={handleAddTestTransaction}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            disabled={accounts.length === 0}
          >
            Add Test Transaction
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
