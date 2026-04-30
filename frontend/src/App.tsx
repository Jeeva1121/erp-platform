import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import "./components/Layout/Layout.css";
import { TenantProvider, useTenant } from "./context/TenantContext";
import { useAuthUser } from "./hooks/useAuthUser";
import AdvancedReports from "./pages/AdvancedReports"; // Added here
import { Toaster } from "react-hot-toast";

// Pages
import AIInsights from "./pages/AIInsights";
import AdminSetup from "./pages/AdminSetup";
import Branches from "./pages/Branches";
import CreateInvoice from "./pages/CreateInvoice";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import DayBook from "./pages/DayBook";
import EditInvoice from "./pages/EditInvoice";
import DocumentManager from "./pages/DocumentManager";
import Employees from "./pages/Employees";
import FileManager from "./pages/FileManager";
import HostLogin from "./pages/HostLogin";
import Attendance from "./pages/hr/Attendance";
import MobileAttendance from "./pages/hr/MobileAttendance";
import Inventory from "./pages/Inventory";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import Ledgers from "./pages/Ledgers";
import Login from "./pages/Login";
import PlatformAdmin from "./pages/PlatformAdmin";
import PurchaseBills from "./pages/PurchaseBills";
import SimplifiedPurchaseBill from "./pages/SimplifiedPurchaseBill";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Subscriptions from "./pages/Subscriptions";
import Suppliers from "./pages/Suppliers";
import Transactions from "./pages/Transactions";
import SimpleDashboard from "./SimpleDashboard";
import SynthesisDashboard from "./SynthesisDashboard";
import CustomerNotifications from "./pages/CustomerNotifications";
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import CustomerShop from "./pages/customer/CustomerShop";
import CustomerLedger from "./pages/customer/CustomerLedger";
import CustomerLayout from "./components/Layout/CustomerLayout";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerPortalLayout from "./pages/customer/CustomerPortalLayout";
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerProducts from "./pages/customer/CustomerProducts";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerLedgerPage from "./pages/customer/CustomerLedgerPage";
import CustomerContact from "./pages/customer/CustomerContact";

// Finance Module
import BankReconciliation from "./pages/finance/BankReconciliation";
import CashReceipts from "./pages/finance/CashReceipts";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import FinancialReports from "./pages/finance/FinancialReports";
import LoanManagement from "./pages/finance/LoanManagement";
import ChitManagement from "./pages/finance/ChitManagement";
import BrokerManagement from "./pages/brokers/BrokerManagement";
import BrokerLedger from "./pages/brokers/BrokerLedger";
import LenderManagement from "./pages/finance/LenderManagement";

// New Reports Module
import ReportsDashboard from "./pages/reports/ReportsDashboard";
import ReportViewer from "./pages/reports/ReportViewer";
import ConsolidatedInventory from "./pages/ConsolidatedInventory";
import StockTransfer from "./pages/StockTransfer";
import StockRequestsInbox from "./pages/StockRequestsInbox";
import BranchBilling from "./pages/BranchBilling";
import GlobalInventory from "./pages/GlobalInventory";
import BillFormatSettings from "./pages/BillFormatSettings";
import PaymentMethodsAdmin from "./pages/PaymentMethodsAdmin";
import SystemTester from "./pages/SystemTester";



// --- 🌐 GLOBAL PAGE TRANSITION ---
const PageTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="canvas-area">{children}</div>;

// --- 🏗️ ENTERPRISE LAYOUT WRAPPER ---
const EnterpriseLayout: React.FC<{
  user: any;
  mode: "HOST" | "ADMIN" | "USER";
}> = ({ user, mode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isBranchUser = user?.role !== 'admin' && user?.branch_id;
  const hideSidebar = isBranchUser;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-hide mobile navbar on scroll down, show on scroll up
  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 60) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <div className="enterprise-shell">
      {!hideSidebar && (
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          isMobile={isMobile}
          mode={mode}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
      )}

      <div
        className={`shell-main ${sidebarOpen ? "blur-content" : ""}`}
        style={{
          marginLeft: (isMobile || hideSidebar) ? "0" : (sidebarCollapsed ? "80px" : "260px"),
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "var(--erp-bg, #f8fafc)",
          padding: 0,
          paddingTop: (isMobile && !hideSidebar) ? "52px" : "0",
        }}
      >
        {/* Mobile Sticky Navbar — auto-hides on scroll */}
        {isMobile && !hideSidebar && (
          <div
            className="mobile-topnav"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: "52px",
              background: "#ffffff",
              borderBottom: "1px solid #e8e8e5",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "0 16px",
              zIndex: 500,
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              transform: navbarVisible ? "translateY(0)" : "translateY(-100%)",
              transition: "transform 0.25s ease",
            }}
          >
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "none",
                border: "none",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#111110",
                borderRadius: "8px",
                flexShrink: 0,
              }}
              aria-label="Open menu"
            >
              <FaBars size={18} />
            </button>

            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              <div style={{
                width: "24px", height: "24px",
                background: "#111110",
                borderRadius: "5px",
                display: "grid", placeItems: "center",
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1.2" fill="white"/>
                  <rect x="9" y="2" width="5" height="5" rx="1.2" fill="white" opacity=".55"/>
                  <rect x="2" y="9" width="5" height="5" rx="1.2" fill="white" opacity=".55"/>
                  <rect x="9" y="9" width="5" height="5" rx="1.2" fill="white" opacity=".25"/>
                </svg>
              </div>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#111110", letterSpacing: "-0.2px" }}>
                {mode === "HOST" ? "Platform Admin" : "Enterprise ERP"}
              </span>
            </div>

            {/* User avatar */}
            <div style={{
              width: "32px", height: "32px",
              borderRadius: "50%",
              background: "#111110",
              color: "#fff",
              display: "grid", placeItems: "center",
              fontSize: "12px", fontWeight: 700,
              flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        )}

        <main style={{ flex: 1, minWidth: 0 }}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Toaster position="top-right" />
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 950,
          }}
        />
      )}

    </div>
  );
};


// --- 🛡️ GUARDS ---
const HostRoute = () => {
  const { user, loading } = useAuthUser();
  if (loading) return <div className="full-screen-loader">Loading...</div>;
  return user?.role?.toLowerCase() === "superadmin" ? (
    <EnterpriseLayout user={user} mode="HOST" />
  ) : (
    <Navigate to="/company-login" />
  );
};

const AdminRoute = () => {
  const { user, loading } = useAuthUser();
  if (loading) return <div className="full-screen-loader">Loading...</div>;
  return user?.role?.toLowerCase() === "admin" ? (
    <EnterpriseLayout user={user} mode="ADMIN" />
  ) : (
    <Navigate to="/dashboard" />
  );
};

const WorkspaceRoute = () => {
  const { user, loading } = useAuthUser();
  if (loading) return <div className="full-screen-loader">Loading...</div>;
  return user ? (
    <EnterpriseLayout user={user} mode="USER" />
  ) : (
    <Navigate to="/company-login" />
  );
};

const CustomerRoute = () => {
  const { user, loading } = useAuthUser();
  if (loading) return <div className="full-screen-loader">Loading...</div>;
  return user?.role?.toLowerCase() === "customer" || user?.role?.toLowerCase() === "user" ? (
    <CustomerLayout />
  ) : (
    <Navigate to="/company-login" />
  );
};

const App: React.FC = () => {
  // App initializing
  return (
    <TenantProvider>
      <Router>
        <Routes>
          <Route path="/company-login" element={<Login />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/host-login" element={<HostLogin />} />
          <Route path="/mark-attendance" element={<MobileAttendance />} />

          <Route element={<HostRoute />}>
            <Route
              path="/platform-admin"
              element={<PlatformAdmin tab="hub" />}
            />
            <Route
              path="/platform-admin/tenants"
              element={<PlatformAdmin tab="tenants" />}
            />
            <Route
              path="/platform-admin/config"
              element={<PlatformAdmin tab="config" />}
            />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin/branches" element={<Branches />} />
            <Route path="/admin/subscriptions" element={<Subscriptions />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/bill-format" element={<BillFormatSettings />} />
            <Route path="/admin/payment-methods" element={<PaymentMethodsAdmin />} />
            <Route path="/admin/system-test" element={<SystemTester />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/employees" element={<Employees />} />
          </Route>

          <Route element={<WorkspaceRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/sales/customer-notifications" element={<CustomerNotifications />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/new" element={<CreateInvoice />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/invoices/edit/:id" element={<EditInvoice />} />
            <Route path="/products" element={<Inventory />} />
            <Route path="/documents" element={<DocumentManager />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/ledgers" element={<Ledgers />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/purchase-bills" element={<PurchaseBills />} />
            <Route path="/purchase-bills/new" element={<SimplifiedPurchaseBill />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/daybook" element={<DayBook />} />
            <Route path="/inventory/consolidated" element={<GlobalInventory />} />
            <Route path="/inventory/transfer" element={<StockTransfer />} />
            <Route path="/inventory/requests" element={<StockRequestsInbox />} />
            <Route path="/branch/billing" element={<BranchBilling />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/employees" element={<Employees />} />

            <Route path="/finance/dashboard" element={<FinanceDashboard />} />
            <Route path="/finance/loans" element={<LoanManagement />} />
            <Route path="/finance/lenders" element={<LenderManagement />} />
            <Route path="/finance/receipts" element={<CashReceipts />} />
            <Route path="/finance/reports" element={<FinancialReports />} />
            <Route
              path="/finance/reconciliation"
              element={<BankReconciliation />}
            />
            <Route path="/finance/chits" element={<ChitManagement />} />
            <Route path="/finance/brokers" element={<BrokerManagement />} />
            <Route path="/finance/brokers/ledger/:id" element={<BrokerLedger />} />
            <Route path="/reports/world-class" element={<AdvancedReports />} />
            
            {/* New Comprehensive Reports Module */}
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/reports/:reportId" element={<ReportViewer />} />
          </Route>

          {/* Legacy Customer Portal */}
          <Route element={<CustomerRoute />}>
            <Route path="/shop" element={<CustomerShop />} />
            <Route path="/my-ledger" element={<CustomerLedger />} />
          </Route>

          {/* New Customer Portal */}
          <Route path="/portal" element={<CustomerPortalLayout />}>
            <Route path="home" element={<CustomerHome />} />
            <Route path="products" element={<CustomerProducts />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="ledger" element={<CustomerLedgerPage />} />
            <Route path="contact" element={<CustomerContact />} />
          </Route>


          {/* Dedicated V2 Synthesis Path - Standalone Layout */}
          <Route path="/synthesis" element={<SynthesisDashboard />} />
          {/* Clean Simple Dashboard */}
          <Route path="/simple" element={<SimpleDashboard />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/company-login" replace />} />
        </Routes>
      </Router>
    </TenantProvider>
  );
};

export default App;
