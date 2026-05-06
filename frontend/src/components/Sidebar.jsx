import { Home, Star, LogOut, Menu, PanelLeftClose, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

function Sidebar({ view, setView, isNavOpen, setIsNavOpen, onSignOut }) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "saved", label: "Saved", icon: Star },
    // LEAD 3: Added Expenses tab
    { id: "expenses", label: "Expenses", icon: DollarSign },
  ];

  return (
    <motion.aside
      className={`sidebar ${isNavOpen ? "open" : "collapsed"}`}
      initial={false}
      animate={{ width: isNavOpen ? 260 : 82 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="sidebar-header">
        {isNavOpen && (
          <div className="sidebar-logo">
            <img src="/logo.png" alt="Route 200 logo" />
          </div>
        )}

        <button
          className="icon-button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle sidebar"
        >
          {isNavOpen ? <PanelLeftClose size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${view === id ? "active" : ""}`}
            onClick={() => setView(id)}
          >
            <Icon size={22} />
            {isNavOpen && <span>{label}</span>}
          </button>
        ))}
      </nav>

      <button className="nav-item sign-out" onClick={onSignOut}>
        <LogOut size={22} />
        {isNavOpen && <span>Sign Out</span>}
      </button>
    </motion.aside>
  );
}

export default Sidebar;