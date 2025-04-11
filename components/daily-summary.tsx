'use client';

import { useState } from 'react';
import { useMoneySaver } from '@/hooks/use-money-saver';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isToday, isYesterday, startOfDay, endOfDay } from 'date-fns';
import { CalendarIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction } from '@/lib/storage';

export default function DailySummary() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { 
    transactions,
    getTransactionsByDateRange,
    getAccountById
  } = useMoneySaver();

  // Get transactions for the selected date
  const dailyTransactions = getTransactionsByDateRange(
    startOfDay(selectedDate),
    endOfDay(selectedDate)
  );

  // Calculate daily totals
  const incomeTotal = dailyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenseTotal = dailyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netChange = incomeTotal - expenseTotal;

  // Function to format date for display
  const formatDateForDisplay = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  // Function to get account name by ID
  const getAccountName = (accountId: string) => {
    const account = getAccountById(accountId);
    return account ? account.name : 'Unknown Account';
  };

  // Group transactions by category for the pie chart
  const expensesByCategory = dailyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomesByCategory = dailyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daily Summary</CardTitle>
          <CardDescription>Track your daily finances</CardDescription>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDateForDisplay(selectedDate)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        {dailyTransactions.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No transactions for this day.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${incomeTotal.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ${expenseTotal.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Net Change</p>
                <p className={`text-2xl font-bold ${netChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ${netChange.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Expense Breakdown</h3>
              {Object.keys(expensesByCategory).length === 0 ? (
                <p className="text-sm text-muted-foreground">No expenses for this day.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(expensesByCategory).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                        <span>{category}</span>
                      </div>
                      <span className="font-medium">${amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Income Breakdown</h3>
              {Object.keys(incomesByCategory).length === 0 ? (
                <p className="text-sm text-muted-foreground">No income for this day.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(incomesByCategory).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span>{category}</span>
                      </div>
                      <span className="font-medium">${amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Transactions</h3>
              <div className="space-y-2">
                {dailyTransactions.map(transaction => (
                  <div key={transaction.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {transaction.description || transaction.category}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.type === 'transfer' 
                            ? `Transfer: ${getAccountName(transaction.fromAccountId || '')} → ${getAccountName(transaction.toAccountId || '')}` 
                            : getAccountName(transaction.accountId)}
                        </p>
                      </div>
                      <p className={`font-semibold ${
                        transaction.type === 'income' 
                          ? 'text-green-500' 
                          : transaction.type === 'expense' 
                            ? 'text-red-500' 
                            : ''
                      }`}>
                        {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                        ${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
