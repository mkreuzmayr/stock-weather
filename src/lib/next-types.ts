export type PageProps<
  T extends Record<string, string | string[] | undefined> = Record<never, never>
> = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<T>;
};

export type LayoutProps<
  T extends Record<string, string | string[] | undefined> = Record<
    never,
    never
  >,
  TParallelLayouts extends string = string
> = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<T>;
  children: React.ReactNode;
} & Record<TParallelLayouts, React.ReactNode>;
