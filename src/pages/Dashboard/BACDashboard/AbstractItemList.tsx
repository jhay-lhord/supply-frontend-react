import DashboardLayout from "../shared/Layouts/DashboardLayout"
import { AbstractItem } from "./components/AbstractItem"
import BACSidebar from "./components/BACSidebar"

export const AbstractItemList: React.FC = () => {
  return (
    <DashboardLayout>
        <BACSidebar />

        <div className="pt-16 w-full p-6">
            <AbstractItem/>
        </div>
            
    </DashboardLayout>

  )
}
