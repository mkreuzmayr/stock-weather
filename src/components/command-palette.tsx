"use client"
import { useEffect, useState } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { Search, X, ArrowUp, ArrowDown, Sparkles } from "lucide-react"
import { useMobile } from "~/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

interface Stock {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  logo: string
  color: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Mock data for stocks (using the data from StockRecommendations)
  const stocks: Stock[] = [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      price: 182.63,
      change: 1.25,
      changePercent: 0.69,
      logo: "/placeholder.svg?height=40&width=40&text=AAPL",
      color: "#A2AAAD",
    },
    {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      price: 417.88,
      change: 2.15,
      changePercent: 0.52,
      logo: "/placeholder.svg?height=40&width=40&text=MSFT",
      color: "#00a4ef",
    },
    {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      price: 152.5,
      change: -0.75,
      changePercent: -0.49,
      logo: "/placeholder.svg?height=40&width=40&text=GOOGL",
      color: "#4285f4",
    },
    {
      ticker: "AMZN",
      name: "Amazon.com, Inc.",
      price: 178.75,
      change: 1.25,
      changePercent: 0.7,
      logo: "/placeholder.svg?height=40&width=40&text=AMZN",
      color: "#ff9900",
    },
    {
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      price: 875.28,
      change: 15.32,
      changePercent: 1.78,
      logo: "/placeholder.svg?height=40&width=40&text=NVDA",
      color: "#76b900",
    },
    {
      ticker: "META",
      name: "Meta Platforms, Inc.",
      price: 492.16,
      change: 4.28,
      changePercent: 0.88,
      logo: "/placeholder.svg?height=40&width=40&text=META",
      color: "#0668E1",
    },
    {
      ticker: "TSLA",
      name: "Tesla, Inc.",
      price: 172.63,
      change: -3.42,
      changePercent: -1.94,
      logo: "/placeholder.svg?height=40&width=40&text=TSLA",
      color: "#cc0000",
    },
    {
      ticker: "JPM",
      name: "JPMorgan Chase & Co.",
      price: 198.47,
      change: 0.89,
      changePercent: 0.45,
      logo: "/placeholder.svg?height=40&width=40&text=JPM",
      color: "#2e3d49",
    },
    {
      ticker: "V",
      name: "Visa Inc.",
      price: 275.96,
      change: 1.23,
      changePercent: 0.45,
      logo: "/placeholder.svg?height=40&width=40&text=V",
      color: "#1a1f71",
    },
    {
      ticker: "WMT",
      name: "Walmart Inc.",
      price: 67.89,
      change: 0.45,
      changePercent: 0.67,
      logo: "/placeholder.svg?height=40&width=40&text=WMT",
      color: "#0071ce",
    },
  ]

  // Filter stocks based on search query
  const filteredStocks = stocks.filter(
    (stock) =>
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Handle keyboard navigation within the command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      // Reset selected index when search query changes
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prevIndex) => (prevIndex < filteredStocks.length - 1 ? prevIndex + 1 : prevIndex))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredStocks.length > 0) {
          handleStockSelect(filteredStocks[selectedIndex])
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, filteredStocks, selectedIndex])

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  const handleStockSelect = (stock: Stock) => {
    console.log(`Selected stock: ${stock.ticker}`)
    // Here you would typically navigate to the stock page or update the current view
    // For now, we'll just close the command palette
    setOpen(false)
    setSearchQuery("")
  }

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
              <span className="text-xs">{navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}</span>K
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

      <CommandDialog open={open} onOpenChange={setOpen}>
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
              onClick={() => setSearchQuery("")}
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
              <CommandItem
                key={stock.ticker}
                onSelect={() => handleStockSelect(stock)}
                className={`flex items-center justify-between py-2 px-2 ${index === selectedIndex ? "bg-accent" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 rounded-md" style={{ backgroundColor: `${stock.color}20` }}>
                    <AvatarImage src={stock.logo} alt={stock.name} />
                    <AvatarFallback style={{ color: stock.color, backgroundColor: `${stock.color}20` }}>
                      {stock.ticker.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{stock.ticker}</div>
                    <div className="text-xs text-muted-foreground">{stock.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                </div>
              </CommandItem>
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
  )
}
