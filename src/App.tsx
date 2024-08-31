import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SupplyDashboard from "./pages/SupplyDashboard";
import BACDashboard from "./pages/BACDashboard";
import BudgetDashboard from "./pages/BudgetDashboard";
import ProtectedRoutes from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

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
            path="/supply-dashboard"
            element={
              <ProtectedRoutes>
                <SupplyDashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/budget-dashboard"
            element={
              <ProtectedRoutes>
                <BudgetDashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/bac-dashboard"
            element={
              <ProtectedRoutes>
                <BACDashboard />
              </ProtectedRoutes>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
