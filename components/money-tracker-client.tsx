'use client';

import { useMoneySaver } from '@/hooks/use-money-saver';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountsManager from './accounts-manager';
import TransactionsManager from './transactions-manager';
import Dashboard from './dashboard';
import CategoryManager from './category-manager';
import { TransactionFormProvider } from './transaction-form-provider';
import { CategoryFormProvider } from './category-form-provider';

export default function MoneyTrackerClient() {
  return (
    <CategoryFormProvider>
      <TransactionFormProvider>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6">
          <Dashboard />
        </TabsContent>
        <TabsContent value="transactions" className="mt-6">
          <TransactionsManager />
        </TabsContent>
        <TabsContent value="accounts" className="mt-6">
          <AccountsManager />
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <CategoryManager />
        </TabsContent>
      </Tabs>
    </TransactionFormProvider>
    </CategoryFormProvider>
  );
}
