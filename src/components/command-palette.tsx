'use client';

import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import { useMobile } from '~/hooks/use-mobile';
import { Stock, searchStocks } from '~/stock-data';
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter stocks based on search query
  const filteredStocks = searchStocks(searchQuery);

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

  const handleStockSelect = useCallback(
    (stock: Stock) => {
      setOpen(false);
      setSearchQuery('');
      router.push(`/${stock.symbol}`);
    },
    [router]
  );

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {!isMobile && (
        <div className="relative mx-auto w-full max-w-sm">
          <button
            onClick={() => setOpen(true)}
            className="bg-card ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-12 w-full items-center justify-between rounded-2xl px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="text-muted-foreground flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search stocks...</span>
            </div>
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
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
          className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center rounded-full p-2 transition-colors"
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
            className="placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="hover:bg-muted rounded-full p-1"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 opacity-50" />
            </button>
          )}
        </div>
        <CommandList>
          <CommandEmpty>No stocks found.</CommandEmpty>
          <CommandGroup heading="Stocks">
            {filteredStocks.map((stock) => (
              <ListStockItem
                key={stock.symbol}
                stock={stock}
                handleStockSelect={handleStockSelect}
              />
            ))}
          </CommandGroup>
          <div className="text-muted-foreground border-t px-2 py-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="opacity-70">Press </span>
                <kbd className="bg-muted pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
                  ↑
                </kbd>
                <span className="opacity-70"> </span>
                <kbd className="bg-muted pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
                  ↓
                </kbd>
                <span className="opacity-70"> to navigate</span>
              </div>
              <div>
                <span className="opacity-70">Press </span>
                <kbd className="bg-muted pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
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
  handleStockSelect: (stock: Stock) => void;
}) {
  const logoTicker = props.stock.symbol.replace('.', '-');
  const logoUrl = `https://assets.parqet.com/logos/symbol/${logoTicker}`;

  return (
    <CommandItem
      tabIndex={0}
      key={props.stock.symbol}
      onSelect={() => props.handleStockSelect(props.stock)}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 rounded-md">
          <AvatarImage src={logoUrl} alt={props.stock.name} />
          <AvatarFallback>{props.stock.symbol.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{props.stock.name}</div>
          <div className="text-muted-foreground text-xs">
            {props.stock.symbol}
          </div>
        </div>
      </div>
    </CommandItem>
  );
}
