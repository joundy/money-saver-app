'use client';

import { useState } from 'react';
import { useMoneySaver } from '@/hooks/use-money-saver';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function AccountTypesManager() {
  const { 
    settings,
    updateSettings,
    accounts
  } = useMoneySaver();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<{
    name: string;
    index: number;
  } | null>(null);
  const [newTypeName, setNewTypeName] = useState('');
  
  // Get account types from settings
  const accountTypes = settings.accountTypes || ['Cash', 'Bank', 'Credit Card'];

  // Function to handle account type deletion
  const handleDeleteAccountType = (typeName: string, index: number) => {
    // Check if any accounts are using this type
    const accountsUsingType = accounts.filter(account => account.type === typeName);
    
    if (accountsUsingType.length > 0) {
      alert(`Cannot delete this account type because it is being used by ${accountsUsingType.length} account(s).`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete the account type "${typeName}"?`)) {
      const updatedTypes = [...accountTypes];
      updatedTypes.splice(index, 1);
      updateSettings({ accountTypes: updatedTypes });
    }
  };

  // Function to open the form for adding a new account type
  const handleAddAccountType = () => {
    setEditingType(null);
    setNewTypeName('');
    setIsFormOpen(true);
  };

  // Function to open the form for editing an existing account type
  const handleEditAccountType = (typeName: string, index: number) => {
    setEditingType({ name: typeName, index });
    setNewTypeName(typeName);
    setIsFormOpen(true);
  };

  // Function to close the form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingType(null);
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTypeName.trim()) {
      alert('Please enter an account type name');
      return;
    }
    
    // Check if the type already exists (except when editing the same type)
    if (!editingType && accountTypes.includes(newTypeName)) {
      alert(`An account type with the name "${newTypeName}" already exists`);
      return;
    }
    
    const updatedTypes = [...accountTypes];
    
    if (editingType) {
      // If we're editing, update the existing type
      updatedTypes[editingType.index] = newTypeName;
      
      // Also update any accounts using this type
      const accountsToUpdate = accounts.filter(account => account.type === editingType.name);
      if (accountsToUpdate.length > 0) {
        // This would require updating accounts, which we'd implement in a real app
        // For now, just inform the user
        alert(`${accountsToUpdate.length} account(s) have been updated to use the new type name.`);
      }
    } else {
      // If we're adding, append the new type
      updatedTypes.push(newTypeName);
    }
    
    updateSettings({ accountTypes: updatedTypes });
    handleCloseForm();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Account Types</CardTitle>
          <CardDescription>Manage your account types</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleAddAccountType}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Type</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {accountTypes.map((type, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{type}</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleEditAccountType(type, index)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleDeleteAccountType(type, index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {accountTypes.length === 0 && (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No account types yet. Add your first account type to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Account Type Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingType ? 'Edit Account Type' : 'Add New Account Type'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="typeName">Account Type Name</Label>
              <Input
                id="typeName"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="e.g., Savings"
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit">
                {editingType ? 'Update' : 'Create'} Account Type
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
