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
import BACPurchaseRequestIncoming from "./pages/Dashboard/BACDashboard/BACPurchaseRequestIncoming";
import ItemDistribution from "./pages/Dashboard/SupplyDashboard/ItemDistribution";
import { ItemDistributionList } from "./pages/Dashboard/SupplyDashboard/components/ItemDistributionList";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RoleBaseRouting />} />

          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />

          <Route
            path="/supply/*"
            element={<ProtectedRoutes allowedRoles={["Supply Officer"]} />}
          >
            <Route path="purchase-request" element={<PurchaseRequest />} />
            <Route
              path="purchase-request/:pr_no"
              element={<PurchaseRequestList />}
            />
            <Route path="purchase-order" element={<PurchaseOrder />} />
            <Route path="in-progress" element={<PurchaseRequestInProgress />} />
            <Route path="abstract-of-quotation/" element={<SupplyAOQ />} />
            <Route path="reports" element={<Reports />} />
            <Route path="inventory" element={<Inventory />} />

            <Route path="stocks" element={<Stocks />} />
            <Route path="item-distribution" element={<ItemDistribution />} />
            <Route path="item-distribution/:pr_no" element={<ItemDistributionList />} />
            <Route path="not-found" element={<ItemNotFound />} />
          </Route>

          <Route
            path="/bac/*"
            element={<ProtectedRoutes allowedRoles={["BAC Officer"]} />}
          >
            <Route
              path="purchase-request/incoming"
              element={<BACPurchaseRequestIncoming />}
            />
            <Route
              path="purchase-request/received"
              element={<BACPurchaseRequestInProgress />}
            />
            <Route
              path="purchase-request/:pr_no"
              element={<BACPurchaseRequestList />}
            />
            <Route
              path="purchase-order/:po_no"
              element={<PurchaseOrderItemList />}
            />
            <Route
              path="request-for-quotation"
              element={<RequestForQuotation />}
            />
            <Route
              path="request-for-quotations"
              element={<AllQuotations title="All Request of Quotation" />}
            />
            <Route
              path="request-for-quotation/:pr_no"
              element={<QuotationList />}
            />
            <Route
              path="abstract-of-quotation/:pr_no"
              element={<AbstractList />}
            />
            <Route path="quotation/:rfq_no" element={<BACQuotation />} />
            <Route
              path="abstract-item-list/:aoq_no"
              element={<BACItemList />}
            />
            <Route
              path="abstract-of-quotation"
              element={<AbstractOfQuotation />}
            />
            <Route path="abstract-of-quotations" element={<AllAbstract />} />
            <Route
              path="item-selected-quotation/:pr_no"
              element={<AbstractItemList />}
            />
            <Route path="bac-reports" element={<BACReports />} />
            <Route path="bac-transaction" element={<BACTransaction />} />
          </Route>

          <Route
            path="/admin/*"
            element={
              <ProtectedRoutes allowedRoles={["Admin", "Supply Officer"]} />
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="requisitioner" element={<Requisitioner />} />
            <Route path="campus-director" element={<CampusDirector />} />
            <Route path="BACmembers" element={<BACmember />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
