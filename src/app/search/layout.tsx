import { Suspense } from "react";
import Loading from "@/components/feature/loading";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
