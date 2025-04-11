'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

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
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`flex items-center gap-2 ${className}`}
      onClick={onAddCategory}
    >
      <PlusCircle className="h-4 w-4" />
      <span>Add Category</span>
    </Button>
  );
}
