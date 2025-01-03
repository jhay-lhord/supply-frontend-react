import { Button } from "@/components/ui/button";
import Layout from "./Layout/SupplyDashboardLayout";
import SupplySidebar from "./SupplySidebar";
import { useNavigate } from "react-router-dom";


export default function ItemNotFound() {
  const navigate = useNavigate()
  return (
    <Layout>
      <SupplySidebar />
      <div className="w-full flex items-center flex-col mt-10">
        <img src="/empty-box.svg" className="w-80 h-80" alt="Empty box" />
        <p>No Item Available to generate the PDF.</p>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    </Layout>
  );
}
