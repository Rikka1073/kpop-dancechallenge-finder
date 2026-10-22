import AdminDashboard from "@/components/admin/AdminDashboard";
import Layout from "@/components/layout/Layout";

const AdminPage = () => {
  return (
    <div className="text-black">
      <Layout>
        <AdminDashboard />
      </Layout>
    </div>
  );
};

export default AdminPage;
