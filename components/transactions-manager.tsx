'use client';

import { useMoneySaver } from '@/hooks/use-money-saver';
import { Transaction } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddTransactionButton from './transaction-buttons';
import { useTransactionForm } from './transaction-form-provider';
import { formatCurrency } from '@/lib/utils';

export default function TransactionsManager() {
  const { 
    transactions, 
    accounts,
    deleteTransaction,
    getAccountById,
    settings
  } = useMoneySaver();
  
  const { openTransactionForm } = useTransactionForm();
  
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Function to handle transaction deletion
  const handleDeleteTransaction = (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transactionId);
    }
  };

  // Function to open the form for adding a new transaction
  const handleAddTransaction = (type: 'income' | 'expense' | 'transfer') => {
    openTransactionForm(type);
  };

  // Function to open the form for editing an existing transaction
  const handleEditTransaction = (transaction: Transaction) => {
    openTransactionForm(transaction.type, transaction);
  };

  // Function to get account name by ID
  const getAccountName = (accountId: string) => {
    const account = getAccountById(accountId);
    return account ? account.name : 'Unknown Account';
  };

  // Function to render transaction icon based on type
  const renderTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'expense':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case 'transfer':
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Manage your financial transactions</CardDescription>
          </div>
          <AddTransactionButton 
            onAddTransaction={() => openTransactionForm()}
            variant="outline"
            size="sm"
          />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expense</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {renderTransactionList(sortedDates, groupedTransactions, 'all')}
            </TabsContent>
            
            <TabsContent value="income" className="space-y-4">
              {renderTransactionList(sortedDates, groupedTransactions, 'income')}
            </TabsContent>
            
            <TabsContent value="expense" className="space-y-4">
              {renderTransactionList(sortedDates, groupedTransactions, 'expense')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transaction form is now handled by the TransactionFormProvider */}
    </>
  );

  // Helper function to render transaction list with filtering
  function renderTransactionList(
    dates: string[], 
    groups: Record<string, Transaction[]>, 
    filter: 'all' | 'income' | 'expense'
  ) {
    if (transactions.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No transactions yet. Add your first transaction to get started.</p>
        </div>
      );
    }

    return dates.map(date => {
      // Filter transactions based on selected tab
      const filteredTransactions = filter === 'all' 
        ? groups[date] 
        : groups[date].filter(t => t.type === filter);
      
      if (filteredTransactions.length === 0) {
        return null;
      }

      // Calculate daily totals
      const incomeTotal = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenseTotal = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return (
        <div key={date} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h3>
            {filter === 'all' && (
              <div className="text-sm">
                <span className="text-green-500 mr-2">+{formatCurrency(incomeTotal, settings.currency)}</span>
                <span className="text-red-500">-{formatCurrency(expenseTotal, settings.currency)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className="p-3 border rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {renderTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium">
                        {transaction.description || 
                          (transaction.type === 'transfer' 
                            ? `Transfer from ${getAccountName(transaction.fromAccountId || '')} to ${getAccountName(transaction.toAccountId || '')}`
                            : transaction.category)
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.type === 'transfer' 
                          ? 'Transfer' 
                          : getAccountName(transaction.accountId)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-green-500' 
                        : transaction.type === 'expense' 
                          ? 'text-red-500' 
                          : ''
                    }`}>
                      {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                      {formatCurrency(transaction.amount, settings.currency)}
                    </p>
                    {transaction.type !== 'transfer' && (
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 h-7 px-2"
                    onClick={() => handleEditTransaction(transaction)}
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Edit</span>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="flex items-center gap-1 h-7 px-2"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    });
  }
}
