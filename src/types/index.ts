export type ChildrenProps = {
  children: React.ReactNode;
};

export type ButtonProps = {
  id: string;
  name: string;
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

export type Record = {
  id: string;
  name: string;
  type: string;
};
