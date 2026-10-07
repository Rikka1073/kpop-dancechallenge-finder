import Header from "@/components/feature/Header";
import Layout from "@/components/layout/Layout";
import AdminDashboard from "@/components/admin/AdminDashboard";

const AdminPage = () => {
  return (
    <div className="text-black">
      <Header />
      <Layout>
        <AdminDashboard />
      </Layout>
    </div>
  );
};

export default AdminPage;
