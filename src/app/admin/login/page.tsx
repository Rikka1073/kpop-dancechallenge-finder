import LoginForm from "@/components/admin/LoginForm";
import Layout from "@/components/layout/Layout";
import { Suspense } from "react";

const AdminLoginPage = () => {
  return (
    <div className="text-black">
      <Layout>
        <Suspense fallback={<span className="loading loading-spinner loading-lg text-primary" />}>
          <LoginForm />
        </Suspense>
      </Layout>
    </div>
  );
};

export default AdminLoginPage;
