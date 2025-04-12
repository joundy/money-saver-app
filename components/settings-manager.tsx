'use client';

import { useMoneySaver } from '@/hooks/use-money-saver';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function SettingsManager() {
  const { 
    settings,
    updateSettings
  } = useMoneySaver();
  
  const handleCurrencyChange = (value: string) => {
    updateSettings({ currency: value });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Customize your Money Saver app</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select 
            value={settings.currency} 
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger id="currency" className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">US Dollar ($)</SelectItem>
              <SelectItem value="IDR">Indonesian Rupiah (Rp)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your preferred currency format for displaying money values.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
