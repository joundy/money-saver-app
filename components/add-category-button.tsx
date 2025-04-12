'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AddCategoryButtonProps {
  onAddCategory: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function AddCategoryButton({ 
  onAddCategory, 
  variant = 'default',
  size = 'default',
  className = ''
}: AddCategoryButtonProps) {
  const isMobile = useIsMobile();
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`flex items-center gap-2 ${className} ${isMobile ? 'rounded-full' : ''}`}
      onClick={onAddCategory}
    >
      <PlusCircle className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
      {!isMobile && <span>Add Category</span>}
      {isMobile && <span className="sr-only">Add Category</span>}
    </Button>
  );
}
