import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ChevronsUpDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { currencies, useCurrency, Currency } from '@/hooks/use-currency';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  // Filter currencies based on search term
  const filteredCurrencies = currencies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  );
  
  // Group currencies by popularity for easier selection
  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'INR'];
  const topCurrencies = filteredCurrencies.filter(c => popularCurrencies.includes(c.code));
  const otherCurrencies = filteredCurrencies.filter(c => !popularCurrencies.includes(c.code));
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          aria-expanded={isOpen} 
          className="min-w-[7rem] justify-between"
        >
          <div className="flex items-center">
            <DollarSign className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{currency.code}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[220px] p-2" align="end">
        <div className="px-2 py-2">
          <Input
            placeholder="Search currency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Popular currencies */}
        {topCurrencies.length > 0 && (
          <>
            <DropdownMenuLabel>Popular Currencies</DropdownMenuLabel>
            <DropdownMenuGroup>
              {topCurrencies.map((c) => (
                <DropdownMenuItem
                  key={c.code}
                  className={cn(
                    "flex items-center justify-between px-2 py-1.5 cursor-pointer",
                    currency.code === c.code && "bg-accent"
                  )}
                  onClick={() => {
                    setCurrency(c);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="mr-1 w-6 text-muted-foreground">{c.symbol}</span>
                    <span>{c.code}</span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate ml-2">
                    {c.name}
                  </span>
                  {currency.code === c.code && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            
            {otherCurrencies.length > 0 && <DropdownMenuSeparator />}
          </>
        )}
        
        {/* Other currencies */}
        {otherCurrencies.length > 0 && (
          <>
            {topCurrencies.length > 0 && <DropdownMenuLabel>Other Currencies</DropdownMenuLabel>}
            <DropdownMenuGroup className={otherCurrencies.length > 8 ? "max-h-[200px] overflow-y-auto" : ""}>
              {otherCurrencies.map((c) => (
                <DropdownMenuItem
                  key={c.code}
                  className={cn(
                    "flex items-center justify-between px-2 py-1.5 cursor-pointer",
                    currency.code === c.code && "bg-accent"
                  )}
                  onClick={() => {
                    setCurrency(c);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <span className="mr-1 w-6 text-muted-foreground">{c.symbol}</span>
                    <span>{c.code}</span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate ml-2">
                    {c.name}
                  </span>
                  {currency.code === c.code && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}
        
        {filteredCurrencies.length === 0 && (
          <div className="text-center py-2 text-sm text-muted-foreground">
            No currencies found
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}