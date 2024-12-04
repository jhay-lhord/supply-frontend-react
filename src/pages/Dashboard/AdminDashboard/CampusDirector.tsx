

import CampusDirectorForm from "./components/campusDirectorForm";
import Layout from "./components/Layout/AdminDashboardLayout";

const CampusDirector: React.FC = () => {
  return (
    <Layout>
     
      <div className=" w-full">
        <CampusDirectorForm />
      </div>
    </Layout>
  );
};

export default CampusDirector;
