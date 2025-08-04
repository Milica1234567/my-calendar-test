import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/");
    } else {
      setUser(savedUser);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.name}!</h2>
      <div>
        <div></div>
      </div>
    </div>
  );
}

export default Dashboard;
