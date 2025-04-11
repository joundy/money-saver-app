'use client';

import { useMoneySaver } from '@/hooks/use-money-saver';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import DailySummary from './daily-summary';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import AddTransactionButton from './transaction-buttons';
import { useTransactionForm } from './transaction-form-provider';
import { Button } from './ui/button';

export default function Dashboard() {
  const { 
    accounts, 
    transactions,
    getTotalBalance,
    getTransactionsByDateRange
  } = useMoneySaver();
  
  const { openTransactionForm } = useTransactionForm();

  const today = new Date();
  
  // Get transactions for different time periods
  const todayTransactions = getTransactionsByDateRange(
    new Date(today.setHours(0, 0, 0, 0)),
    new Date(today.setHours(23, 59, 59, 999))
  );
  
  const weekTransactions = getTransactionsByDateRange(
    startOfWeek(today),
    endOfWeek(today)
  );
  
  const monthTransactions = getTransactionsByDateRange(
    startOfMonth(today),
    endOfMonth(today)
  );

  // Calculate totals for different time periods
  const calculateTotals = (txs: any[]) => {
    const incomeTotal = txs
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenseTotal = txs
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      income: incomeTotal,
      expense: expenseTotal,
      net: incomeTotal - expenseTotal
    };
  };

  const todayTotals = calculateTotals(todayTransactions);
  const weekTotals = calculateTotals(weekTransactions);
  const monthTotals = calculateTotals(monthTransactions);

  // Group transactions by date
  const groupTransactionsByDate = () => {
    const grouped = transactions.reduce((groups, transaction) => {
      const date = new Date(transaction.date).toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as Record<string, any[]>);

    // Sort dates in descending order (newest first)
    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 7) // Get last 7 days with transactions
      .map(date => ({
        date,
        transactions: grouped[date],
        totals: calculateTotals(grouped[date])
      }));
  };

  const recentDays = groupTransactionsByDate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <AddTransactionButton 
          onAddTransaction={openTransactionForm}
          variant="outline"
          size="sm"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalBalance().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {accounts.length} accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+${monthTotals.income.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {format(startOfMonth(today), 'MMM d')} - {format(endOfMonth(today), 'MMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">-${monthTotals.expense.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {format(startOfMonth(today), 'MMM d')} - {format(endOfMonth(today), 'MMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Summary</TabsTrigger>
          <TabsTrigger value="recent">Recent Days</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-4">
          <DailySummary />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Days Summary</CardTitle>
              <CardDescription>Financial activity for the past 7 days with transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentDays.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">No recent transactions.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentDays.map(day => (
                    <div key={day.date} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">
                          {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
                        </h3>
                        <div className="text-sm">
                          <span className="text-green-500 mr-2">+${day.totals.income.toFixed(2)}</span>
                          <span className="text-red-500 mr-2">-${day.totals.expense.toFixed(2)}</span>
                          <span className={day.totals.net >= 0 ? 'text-green-500' : 'text-red-500'}>
                            Net: ${day.totals.net.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="pl-4 border-l-2 border-muted space-y-2">
                        {day.transactions.slice(0, 3).map(transaction => (
                          <div key={transaction.id} className="flex justify-between items-center p-2 rounded-md bg-muted/30">
                            <span className="text-sm">
                              {transaction.description || transaction.category}
                            </span>
                            <span className={`text-sm font-medium ${
                              transaction.type === 'income' 
                                ? 'text-green-500' 
                                : transaction.type === 'expense' 
                                  ? 'text-red-500' 
                                  : ''
                            }`}>
                              {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                              ${transaction.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {day.transactions.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{day.transactions.length - 3} more transactions
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
