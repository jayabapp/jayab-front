export type MobileNavEntry = {
  id: number | string;
  icon: string;
  route: string;
  title: string;
};

export type MobileNavItemProps = {
  entry: MobileNavEntry;
  hasBadge?: boolean;
  onSelect: (route: string) => void;
};

export type MobileNavCreateButtonProps = {
  onSelect: () => void;
};
