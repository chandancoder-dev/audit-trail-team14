import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Track auth state reactively. Reading localStorage directly during render
    // does not re-render on login/logout, so mirror it into state and refresh it
    // whenever the route changes or an auth event fires.
    const [isLoggedIn, setIsLoggedIn] = useState(
      () => localStorage.getItem("token") !== null
    );

    useEffect(() => {
      const syncAuth = () =>
        setIsLoggedIn(localStorage.getItem("token") !== null);

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
      setIsLoggedIn(false);
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
          to="/about"
          className={({ isActive }) =>
            `transition-colors ${
              isActive
                ? "text-blue-400"
                : "text-gray-300 hover:text-white"
            }`
          }
        >
          About
        </NavLink>

        <NavLink
          to="/features"
          className={({ isActive }) =>
            `transition-colors ${
              isActive
                ? "text-blue-400"
                : "text-gray-300 hover:text-white"
            }`
          }
        >
          Features
        </NavLink>

        {isLoggedIn && (
          <NavLink
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            Dashboard
          </NavLink>
        )}

        {isLoggedIn ? (
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="px-4 py-2 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors"
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;