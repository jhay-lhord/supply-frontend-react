import DashboardLayout from "../shared/Layouts/DashboardLayout"
import { AbstractItemContentList } from "./components/AbstractItemContentList"
import BACSidebar from "./components/BACSidebar"

export const BACItemList: React.FC = () => {
  return (
    <DashboardLayout>
        <BACSidebar />

        <div className="pt-16 w-full p-6">
            <AbstractItemContentList/>
        </div>
            
    </DashboardLayout>

  )
}
