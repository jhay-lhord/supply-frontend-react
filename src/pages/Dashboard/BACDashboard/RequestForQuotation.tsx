import DashboardLayout from "../shared/Layouts/DashboardLayout"
import BACSidebar from "../BACDashboard/components/BACSidebar"
import AbstractOfQuotationDataTable from "./components/AbstractOfQuotationDataTable"

const RequestForQuotation: React.FC = () => {
  return (
    <DashboardLayout>
        <BACSidebar />

        <div className="pt-16 w-full">
            <AbstractOfQuotationDataTable/>
        </div>
            
    </DashboardLayout>

  )
}

export default RequestForQuotation