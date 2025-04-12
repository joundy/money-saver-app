'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`flex items-center gap-2 ${className} ${isMobile ? 'rounded-full' : ''}`}
      onClick={onAddTransaction}
    >
      <PlusCircle className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
      {!isMobile && <span>Add Transaction</span>}
      {isMobile && <span className="sr-only">Add Transaction</span>}
    </Button>
  );
}
