import { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function DashboardNavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    

    useEffect(() => {
      const syncAuth = () =>

      // Re-check on route change (covers login -> /dashboard navigation)
      syncAuth();

      // Re-check when the token changes in another tab, or when we dispatch
      // a manual "auth-changed" event after login/logout.
      window.addEventListener("storage", syncAuth);
      window.addEventListener("auth-changed", syncAuth);

      return () => {
        window.removeEventListener("storage", syncAuth);
        window.removeEventListener("auth-changed", syncAuth);
      };
    }, [location]);

   function logout(){
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/login");
   }
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-slate-900 text-white">
      
      {/* Logo */}
      <div className="text-xl font-bold">
        Audit<span className="text-blue-400">Trail</span>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-8">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `transition-colors ${
              isActive
                ? "text-blue-400"
                : "text-gray-300 hover:text-white"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/shipment-operations"
          className={({ isActive }) =>
            `transition-colors ${
              isActive
                ? "text-blue-400"
                : "text-gray-300 hover:text-white"
            }`
          }
        >
          Shipment Operations
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `transition-colors ${
              isActive
                ? "text-blue-400"
                : "text-gray-300 hover:text-white"
            }`
          }
        >
          Alerts
        </NavLink>
        
        
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            Logout
          </button>
          
      </div>
    </nav>
  );
}

export default DashboardNavBar;