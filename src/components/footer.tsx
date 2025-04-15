export function Footer() {
  return (
    <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
      <div className="flex flex-row gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Data from Finnhub and Polygon
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
        <a
          className="text-xs text-gray-500 dark:text-gray-400"
          href="https://parqet.com/api"
        >
          Logos provided by Parqet
        </a>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Updated just now
      </span>
    </div>
  );
}
