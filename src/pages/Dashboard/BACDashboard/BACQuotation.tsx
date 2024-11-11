import DashboardLayout from "../shared/Layouts/DashboardLayout"
import BACSidebar from "./components/BACSidebar"
import {Quotation} from "./components/Quotation"

export const BACQuotation: React.FC = () => {
  return (
    <DashboardLayout>
        <BACSidebar />

        <div className="pt-16 w-full p-6">
            <Quotation/>
        </div>
            
    </DashboardLayout>

  )
}
