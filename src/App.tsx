import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import Login from "@/pages/Forms/Login";
import Register from "@/pages/Forms/Register";
import ProtectedRoutes from "./components/Auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import RoleBaseRouting from "./components/Auth/RoleBaseRouting";
import PurchaseRequest from "./pages/Dashboard/SupplyDashboard/PurchaseRequest";
import PurchaseOrder from "./pages/Dashboard/SupplyDashboard/PurchaseOrder";
import Reports from "./pages/Dashboard/SupplyDashboard/Reports";
import Inventory from "./pages/Dashboard/SupplyDashboard/Inventory";
import RequestForQuotation from "./pages/Dashboard/BACDashboard/RequestForQuotation";
import AbstractOfQuotation from "./pages/Dashboard/BACDashboard/AbstractOfQuotation";
import BACReports from "./pages/Dashboard/BACDashboard/BACReports";
import BACTransaction from "./pages/Dashboard/BACDashboard/BACTransaction";
import Budget from "./pages/Dashboard/BudgetDashboard/Budget";
import BudgetReports from "./pages/Dashboard/BudgetDashboard/BudgetReports";
import BudgetTransaction from "./pages/Dashboard/BudgetDashboard/BudgetTransaction";

const queryClient = new QueryClient();

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

const RegisterAndLogout = () => {
  localStorage.clear();
  return <Register />;
};

const App = () => {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <RoleBaseRouting />
              </ProtectedRoutes>
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
          
          {/* Pages in Supply Dashboard*/}
          <Route path="/purchase-request" element={<PurchaseRequest />} />
          <Route path="/purchase-order" element={<PurchaseOrder />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/inventory" element={<Inventory />} />

          {/* Pages in BAC Dashboard */}
          <Route path="/request-for-quotation" element={<RequestForQuotation/>}/>
          <Route path="/abstract-of-quotation" element={<AbstractOfQuotation/>}/>
          <Route path="/bac-reports" element={<BACReports/>}/>
          <Route path="/bac-transaction" element={<BACTransaction/>} />

          {/* Pages in Budget Dashboard */}
          <Route path="/budget" element={<Budget/>} />
          <Route path="/budget-reports" element={<BudgetReports/>}/>
          <Route path="/budget-transaction" element={<BudgetTransaction/>}/>
        </Routes>
      </Router>
      </QueryClientProvider>
    </>
  );
};

export default App;
