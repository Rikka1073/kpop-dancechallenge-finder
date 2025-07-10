import { ChildrenProps } from "@/types";

const Layout = ({ children }: ChildrenProps) => {
  return <div className="container mx-auto px-4 py-8">{children}</div>;
};

export default Layout;
