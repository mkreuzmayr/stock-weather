import { CommandPalette } from './command-palette';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white">
          <div className="h-5 w-5 rounded-full bg-white dark:bg-black"></div>
        </div>
        <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
          (Not Boring) Stocks
        </span>
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
