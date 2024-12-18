

import UsersDataTable from "./components/UsersDataTable";
import Layout from "./components/Layout/AdminDashboardLayout";

const Users: React.FC = () => {
  return (
    <Layout>
      
      <div className=" w-full">
        <UsersDataTable />
      </div>
    </Layout>
  );
};

export default Users;
