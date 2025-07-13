import Header from "@/components/feature/Header";
import Layout from "@/components/layout/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <Layout>
        <h1>Home</h1>
        <Link href="/about">About</Link>
      </Layout>
    </>
  );
}
