import Header from "@/components/feature/Header";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/admin/LoginForm";
import { Suspense } from "react";

export const runtime = "edge";

const AdminLoginPage = () => {
  return (
    <div className="text-black">
      <Header />
      <Layout>
        <Suspense fallback={<span className="loading loading-spinner loading-lg text-primary" />}>
          <LoginForm />
        </Suspense>
      </Layout>
    </div>
  );
};

export default AdminLoginPage;
