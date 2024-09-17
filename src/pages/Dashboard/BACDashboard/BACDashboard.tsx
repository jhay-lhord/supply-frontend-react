import DashboardLayout from "@/pages/Dashboard/shared/Layouts/DashboardLayout";

const BACDashboard = () => {
  return (
    <DashboardLayout>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-100 p-4 border-r border-gray-200">
        <nav>
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 font-semibold"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 font-semibold"
              >
                Supply Officer Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 font-semibold"
              >
                Budget Officer Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 font-semibold"
              >
                BAC Officer Dashboard
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Analytics Section */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
            <div className="space-y-4">
              {/* Replace with actual analytics widgets */}
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                Analytics Widget 1
              </div>
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                Analytics Widget 2
              </div>
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                Analytics Widget 3
              </div>
            </div>
          </section>

          {/* Recent Activities Section */}
          <section className="lg:col-span-1 overflow-auto">
            <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {/* Replace with actual activity items */}
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                Activity 1
              </div>
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                Activity 2
              </div>
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                Activity 3
              </div>
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default BACDashboard;
