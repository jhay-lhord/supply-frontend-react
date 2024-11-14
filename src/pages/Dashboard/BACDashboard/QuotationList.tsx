import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";
import BACSidebar from "./components/BACSidebar";
import { QuotationCard } from "./components/QuotationCard";


export const QuotationList: React.FC = () => {
  return (
    <DashboardLayout>
        <BACSidebar />

        <div className="pt-16 w-full m-8">
            <QuotationCard isDeleteAllowed={true} title={"All Quotes"}/>
        </div>
            
    </DashboardLayout>
  );
};


