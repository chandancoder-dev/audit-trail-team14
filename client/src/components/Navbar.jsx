import { NavLink, useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();
   function logout(){
       
      localStorage.removeItem("token");
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
        {
          localStorage.getItem("token") ?
          <NavLink
              to="/dashboard"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Dashboard
            </NavLink> 
            :
             null
        }

        {   
           (localStorage.getItem("token") === null) ?
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Login
            </NavLink>
            :
             <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Logout
            </button>
        }
        
        
        <NavLink
          to="/register"
          className="px-4 py-2 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors"
        >
          Register
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;