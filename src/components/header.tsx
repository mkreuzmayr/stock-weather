import { ChartCandlestick } from 'lucide-react';
import { CommandPalette } from './command-palette';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <div className="mb-6 flex items-center justify-between pr-4">
      <div className="flex h-12 items-center gap-3 rounded-2xl border px-4 py-2">
        <ChartCandlestick className="size-7"></ChartCandlestick>
        <span className="font-mono text-xl font-bold">StockWeather</span>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex flex-1 justify-center md:block md:w-[270px]">
          <CommandPalette />
        </div>
      </div>
    </div>
  );
}
