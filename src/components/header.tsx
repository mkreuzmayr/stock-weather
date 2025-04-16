import { useTheme } from 'next-themes';
import Image from 'next/image';
import LogoDark from '~/images/logo_dark.png';
import LogoLight from '~/images/logo_light.png';
import { CommandPalette } from './command-palette';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const { theme } = useTheme();

  const logo = theme === 'dark' ? LogoDark : LogoLight;

  return (
    <div className="mb-6 flex items-center justify-between pr-4">
      <div className="flex h-12 items-center justify-center gap-4">
        <Image
          src={logo}
          alt="StockWeather Logo"
          width={256}
          height={256}
          className="size-full overflow-hidden rounded-xl shadow-sm"
        />
        <div className="text-foreground/90 text-2xl font-bold">
          StockWeather
        </div>
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
