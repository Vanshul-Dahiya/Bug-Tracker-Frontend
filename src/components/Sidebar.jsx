import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">B</div>
        <span>BugTracker</span>
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/dashboard"
          className="nav-item"
        >
          <span>▦</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className="nav-item"
        >
          <span>◫</span>
          Projects
        </NavLink>

        <NavLink
          to="/tickets"
          className="nav-item"
        >
          <span>✓</span>
          Tickets
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;