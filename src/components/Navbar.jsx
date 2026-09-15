import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">

      <div>
        <h2>Bug Tracking System</h2>
      </div>

      <div className="navbar-user">

        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="user-info">
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default Navbar;