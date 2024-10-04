import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
        </Routes>
      </Router>
    </>
  );
};

export default App;
