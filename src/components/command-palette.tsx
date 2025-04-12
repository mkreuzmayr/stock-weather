'use client';
import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import { Search, X } from 'lucide-react';
import { useMobile } from '~/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Stock, searchStocks } from '~/stock-data';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter stocks based on search query
  const filteredStocks = searchStocks(searchQuery);

  console.log(searchQuery, filteredStocks);

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Handle keyboard navigation within the command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      // Reset selected index when search query changes
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < filteredStocks.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredStocks.length > 0) {
          handleStockSelect(filteredStocks[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredStocks, selectedIndex]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleStockSelect = (stock: Stock) => {
    console.log(`Selected stock: ${stock.symbol}`);
    // Here you would typically navigate to the stock page or update the current view
    // For now, we'll just close the command palette
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {!isMobile && (
        <div className="relative w-full max-w-sm mx-auto">
          <button
            onClick={() => setOpen(true)}
            className="flex h-12 w-full items-center justify-between rounded-2xl shadow-sm bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Search stocks...</span>
            </div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
              </span>
              K
            </kbd>
          </button>
        </div>
      )}

      {isMobile && (
        <button
          onClick={() => setOpen(true)}
          className="flex p-2 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          aria-label="Search stocks"
        >
          <Search className="h-5 w-5" />
        </button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{
          // We use custom filtering in the command list
          shouldFilter: false,
        }}
      >
        <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Search stocks by name or ticker..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="rounded-full p-1 hover:bg-muted"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 opacity-50" />
            </button>
          )}
        </div>
        <CommandList>
          <CommandEmpty>No stocks found.</CommandEmpty>
          <CommandGroup heading="Stocks">
            {filteredStocks.map((stock, index) => (
              <ListStockItem
                key={stock.symbol}
                stock={stock}
                index={index}
                selectedIndex={selectedIndex}
                handleStockSelect={handleStockSelect}
              />
            ))}
          </CommandGroup>
          <div className="py-2 px-2 text-xs text-muted-foreground border-t">
            <div className="flex items-center justify-between">
              <div>
                <span className="opacity-70">Press </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  ↑
                </kbd>
                <span className="opacity-70"> </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  ↓
                </kbd>
                <span className="opacity-70"> to navigate</span>
              </div>
              <div>
                <span className="opacity-70">Press </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  Enter
                </kbd>
                <span className="opacity-70"> to select</span>
              </div>
            </div>
          </div>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function ListStockItem(props: {
  stock: Stock;
  index: number;
  selectedIndex: number;
  handleStockSelect: (stock: Stock) => void;
}) {
  const logoTicker = props.stock.symbol.replace('.', '-');
  const logoUrl = `https://assets.parqet.com/logos/symbol/${logoTicker}`;

  return (
    <CommandItem
      key={props.stock.symbol}
      onSelect={() => props.handleStockSelect(props.stock)}
      className={`flex items-center justify-between py-2 px-2 ${
        props.index === props.selectedIndex ? 'bg-accent' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 rounded-md">
          <AvatarImage src={logoUrl} alt={props.stock.name} />
          <AvatarFallback>{props.stock.symbol.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{props.stock.name}</div>
          <div className="text-xs text-muted-foreground">
            {props.stock.symbol}
          </div>
        </div>
      </div>
      {/* <div className="flex items-center gap-2">
      <div className="text-right">
        <div className="font-medium">${stock.price.toFixed(2)}</div>
        <div className="flex items-center justify-end">
          {stock.change >= 0 ? (
            <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 text-rose-500 mr-1" />
          )}
          <span className={`text-xs ${stock.change >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {stock.change >= 0 ? "+" : ""}
            {stock.change} ({stock.change >= 0 ? "+" : ""}
            {stock.changePercent}%)
          </span>
        </div>
      </div>
      {stock.change > 5 && <Sparkles className="h-4 w-4 text-amber-400" />}
    </div> */}
    </CommandItem>
  );
}
