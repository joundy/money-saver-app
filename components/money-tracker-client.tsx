'use client';

import { useMoneySaver } from '@/hooks/use-money-saver';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountsManager from './accounts-manager';
import TransactionsManager from './transactions-manager';
import Dashboard from './dashboard';
import CategoryManager from './category-manager';
import SettingsManager from './settings-manager';
import { TransactionFormProvider } from './transaction-form-provider';
import { CategoryFormProvider } from './category-form-provider';
import { useIsMobile } from '@/hooks/use-mobile';
import { LayoutDashboard, Receipt, Wallet, Tags, Settings } from 'lucide-react';

export default function MoneyTrackerClient() {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative">
      <CategoryFormProvider>
        <TransactionFormProvider>
          <Tabs defaultValue="dashboard" className="w-full">
            {/* Desktop tabs */}
            {!isMobile && (
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dashboard" className="flex items-center justify-center gap-1">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="text-xs md:text-sm">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center justify-center gap-1">
                  <Receipt className="h-4 w-4" />
                  <span className="text-xs md:text-sm">Transactions</span>
                </TabsTrigger>
                <TabsTrigger value="accounts" className="flex items-center justify-center gap-1">
                  <Wallet className="h-4 w-4" />
                  <span className="text-xs md:text-sm">Accounts</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center justify-center gap-1">
                  <Tags className="h-4 w-4" />
                  <span className="text-xs md:text-sm">Categories</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center justify-center gap-1">
                  <Settings className="h-4 w-4" />
                  <span className="text-xs md:text-sm">Settings</span>
                </TabsTrigger>
              </TabsList>
            )}
            
            {/* Mobile floating bottom navigation */}
            {isMobile && (
              <TabsList className="fixed bottom-0 left-0 right-0 z-50 grid w-full grid-cols-5 border-t border-border bg-background shadow-lg">
                <TabsTrigger value="dashboard" className="flex flex-col items-center justify-center py-2 px-1">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex flex-col items-center justify-center py-2 px-1">
                  <Receipt className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Transactions</span>
                </TabsTrigger>
                <TabsTrigger value="accounts" className="flex flex-col items-center justify-center py-2 px-1">
                  <Wallet className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Accounts</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex flex-col items-center justify-center py-2 px-1">
                  <Tags className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Categories</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex flex-col items-center justify-center py-2 px-1">
                  <Settings className="h-5 w-5" />
                  <span className="text-[10px] mt-1">Settings</span>
                </TabsTrigger>
              </TabsList>
            )}
            
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
            <TabsContent value="settings" className="mt-6">
              <SettingsManager />
            </TabsContent>
          </Tabs>
        </TransactionFormProvider>
      </CategoryFormProvider>
      
      {/* Add padding at the bottom for mobile to account for the floating navigation */}
      {isMobile && <div className="pb-16"></div>}
    </div>
  );
}
