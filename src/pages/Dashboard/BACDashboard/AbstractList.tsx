import DashboardLayout from "../shared/Layouts/DashboardLayout"
import Abstract from "./components/Abstract"
import BACSidebar from "./components/BACSidebar"

export const AbstractList: React.FC = () => {
  return (
    <DashboardLayout>
        <BACSidebar />

        <div className="pt-16 w-full p-6">
            <Abstract/>
        </div>
            
    </DashboardLayout>

  )
}
