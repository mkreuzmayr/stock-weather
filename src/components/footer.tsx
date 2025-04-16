export function Footer() {
  return (
    <div className="mt-12 flex items-center justify-between border-t border-border px-4 pt-4">
      <div className="flex flex-row gap-2">
        <span className="text-xs text-muted-foreground">
          Data from Finnhub and Polygon
        </span>
        <span className="text-xs text-muted-foreground">|</span>
        <a
          className="text-xs text-muted-foreground"
          href="https://parqet.com/api"
        >
          Logos provided by Parqet
        </a>
      </div>
      <span className="text-xs text-muted-foreground">
        Updated just now
      </span>
    </div>
  );
}
