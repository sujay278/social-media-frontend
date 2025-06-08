import { useNavigate } from 'react-router-dom';
import './Logout.css';
import { toast } from 'react-toastify';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    toast.success('Logged out successfully!', {
      position: 'top-right',
      autoClose: 1000,
      onClose: () => navigate('/login')
    });
  };

  return (
    <div className="logout-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
