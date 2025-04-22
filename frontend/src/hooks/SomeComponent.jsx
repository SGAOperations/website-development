import { useAuth } from "./useAuth.js";

const SomeComponent = () => {
  const { user, login, logout } = useAuth();

  return (
    <div style={{
      minHeight: '100px',
      padding: '20px',
      border: '1px solid #ccc', // Visual container
      backgroundColor: '#f9f9f9',
      color: '#000000' 
    }}>
      {user ? (
        <>
          <p>Welcome, {user?.name || 'User'}!</p>
          <button 
            onClick={logout}
            style={{ padding: '8px 16px' }}
          >
            Logout
          </button>
        </>
      ) : (
        <button 
          onClick={() => login({ name: "John Doe" })}
          style={{ padding: '8px 16px' }}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default SomeComponent;