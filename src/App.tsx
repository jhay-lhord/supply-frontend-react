import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/Forms/Login";
import ProtectedRoutes from "./components/Auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import RoleBaseRouting from "./components/Auth/RoleBaseRouting";
import PurchaseRequest from "./pages/Dashboard/SupplyDashboard/PurchaseRequest";
import PurchaseRequestList from "./pages/Dashboard/SupplyDashboard/PurchaseRequestList";
import PurchaseOrder from "./pages/Dashboard/SupplyDashboard/PurchaseOrder";
import Reports from "./pages/Dashboard/SupplyDashboard/Reports";
import Inventory from "./pages/Dashboard/SupplyDashboard/Inventory";
import RequestForQuotation from "./pages/Dashboard/BACDashboard/RequestForQuotation";
import AbstractOfQuotation from "./pages/Dashboard/BACDashboard/AbstractOfQuotation";
import BACReports from "./pages/Dashboard/BACDashboard/BACReports";
import BACTransaction from "./pages/Dashboard/BACDashboard/BACTransaction";
import AdminDashboard from "./pages/Dashboard/AdminDashboard/Dashboard";
import Users from "./pages/Dashboard/AdminDashboard/Users";
import PurchaseRequestInProgress from "./pages/Dashboard/SupplyDashboard/PurchaseRequestInProgress";
import BACPurchaseRequestInProgress from "./pages/Dashboard/BACDashboard/BACPurchaseRequestInProgress";
import { Logout, RegisterAndLogout } from "./components/Auth/auth";
import BACPurchaseRequestList from "./pages/Dashboard/BACDashboard/BACPurchaseRequestList";
import ItemNotFound from "./pages/Dashboard/SupplyDashboard/components/ItemNotFound";
import { QuotationList } from "./pages/Dashboard/BACDashboard/QuotationList";
import { BACQuotation } from "./pages/Dashboard/BACDashboard/BACQuotation";
import { AbstractList } from "./pages/Dashboard/BACDashboard/AbstractList";
import { AbstractItemList } from "./pages/Dashboard/BACDashboard/AbstractItemList";
import { BACItemList } from "./pages/Dashboard/BACDashboard/BACItemList";
import Requisitioner from "./pages/Dashboard/AdminDashboard/Requisitioner";
import CampusDirector from "./pages/Dashboard/AdminDashboard/CampusDirector";
import BACmember from "./pages/Dashboard/AdminDashboard/BACmember";
import { AllQuotations } from "./pages/Dashboard/BACDashboard/AllQuotations";
import { AllAbstract } from "./pages/Dashboard/BACDashboard/AllAbstract";
import SupplyAOQ from "./pages/Dashboard/SupplyDashboard/components/AbstractOfQuotation";
import Stocks from "./pages/Dashboard/SupplyDashboard/Stocks";
import PurchaseOrderItemList from "./pages/Dashboard/SupplyDashboard/components/PurchaseOrderItemList";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <RoleBaseRouting />
              </ProtectedRoutes>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />

          {/* Pages in Supply Dashboard*/}
          <Route
            path="/supply/purchase-request"
            element={<PurchaseRequest />}
          />
          <Route
            path="/supply/purchase-request/:pr_no"
            element={<PurchaseRequestList />}
          />
          <Route path="/supply/purchase-order" element={<PurchaseOrder />} />
          <Route
            path="/supply/in-progress"
            element={<PurchaseRequestInProgress />}
          />
          <Route
            path="/supply/abstract-of-quotation/"
            element={<SupplyAOQ />}
          />
          <Route path="/supply/reports" element={<Reports />} />
          <Route path="/supply/inventory" element={<Inventory />} />

          <Route path="/supply/stocks" element={<Stocks />} />
          <Route path="/supply/not-found" element={<ItemNotFound />} />

          {/* Pages in BAC Dashboard */}
          <Route
            path="/bac/purchase-request"
            element={<BACPurchaseRequestInProgress />}
          />
          <Route
            path="/bac/purchase-request/:pr_no"
            element={<BACPurchaseRequestList />}
          />
          <Route
            path="/bac/purchase-order/:po_no"
            element={<PurchaseOrderItemList />}
          />
          <Route
            path="/bac/request-for-quotation"
            element={<RequestForQuotation />}
          />
          <Route
            path="/bac/request-for-quotations"
            element={<AllQuotations title="All Request of Quotation" />}
          />
          <Route
            path="/bac/request-for-quotation/:pr_no"
            element={<QuotationList />}
          />
          <Route
            path="/bac/abstract-of-quotation/:pr_no"
            element={<AbstractList />}
          />
          <Route path="/bac/quotation/:rfq_no" element={<BACQuotation />} />
          <Route
            path="/bac/abstract-item-list/:aoq_no"
            element={<BACItemList />}
          />
          <Route
            path="/bac/abstract-of-quotation"
            element={<AbstractOfQuotation />}
          />
          <Route path="/bac/abstract-of-quotations" element={<AllAbstract />} />
          <Route
            path="/bac/item-selected-quotation/:pr_no"
            element={<AbstractItemList />}
          />
          <Route path="/bac/bac-reports" element={<BACReports />} />
          <Route path="/bac/bac-transaction" element={<BACTransaction />} />

          {/* Pages in Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/requisitioner" element={<Requisitioner />} />
          <Route path="/admin/campus-director" element={<CampusDirector />} />
          <Route path="/admin/BACmembers" element={<BACmember />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
