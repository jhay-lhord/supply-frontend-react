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
          
          {/* purchase request */}
          <Route path="/purchase-request" element={<PurchaseRequest />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
