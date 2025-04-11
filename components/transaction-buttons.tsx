'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AddTransactionButtonProps {
  onAddTransaction: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function AddTransactionButton({ 
  onAddTransaction, 
  variant = 'default',
  size = 'default',
  className = ''
}: AddTransactionButtonProps) {
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`flex items-center gap-2 ${className}`}
      onClick={onAddTransaction}
    >
      <PlusCircle className="h-4 w-4" />
      <span>Add Transaction</span>
    </Button>
  );
}
