import React from "react";
import { useTaxCalculator } from "./TaxCalculatorProvider";
import { countryCurrencyMap } from "@/lib/currency";
import { countries } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Country {
  id: string;
  name: string;
}

const CountrySelector: React.FC = () => {
  const { country, setCountry, formatCurrencyWithCountry } = useTaxCalculator();

  return (
    <div className="space-y-2">
      <Label htmlFor="country">Country</Label>
      <Select 
        value={country} 
        onValueChange={setCountry}
      >
        <SelectTrigger className="w-full bg-muted">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] transition-all duration-300">
          {countries.map((countryItem: Country) => {
            const currency = countryCurrencyMap[countryItem.id.toLowerCase()];
            return (
              <SelectItem 
                key={countryItem.id} 
                value={countryItem.id}
                className="flex items-center gap-2"
              >
                <span>{currency?.flag}</span>
                <span>{countryItem.name}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-muted-foreground ml-2">
                        ({currency?.code})
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{currency?.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountrySelector; 