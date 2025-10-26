import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const defaultCategory = {
  name: "Ostalo",
  color: "#000000",
  id: "default",
};

const initialCategories = [
  { name: "", color: "", id: "custom-1" },
  { name: "", color: "", id: "custom-2" },
  { name: "", color: "", id: "custom-3" },
];

const colorOptions = [
  { name: "Crvena", value: "#ef4444" },
  { name: "Plava", value: "#3b82f6" },
  { name: "Zelena", value: "#10b981" },
  { name: "Žuta", value: "#facc15" },
  { name: "Ljubičasta", value: "#a855f7" },
  { name: "Narandžasta", value: "#f97316" },
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [categories, setCategories] = useState(() => {
      const saved = localStorage.getItem("categories");
      if (saved) return JSON.parse(saved);
  
      return [...initialCategories, defaultCategory];
    });
  
    useEffect(() => {
      localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories]);
  
    const handleChange = (index, field, value) => {
      const updated = [...categories];
      updated[index][field] = value;
      setCategories(updated);
    };
  
    const handleReset = () => {
      setCategories([...initialCategories, defaultCategory]);
    };

   useEffect(() => {
    const hasSeenModal = localStorage.getItem(`hasSeenModal_${user?.email}`);

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setShowModal(true);
        localStorage.setItem(`hasSeenModal_${user?.email}`, "true");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user?.email]);

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
      <div
        className="waves"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: -1,
        }}
      >
        <svg viewBox="0 0 2 1" preserveAspectRatio="none">
          <defs>
            <path
              id="w"
              d="
      m0 1v-.5 
      q.5.5 1 0
      t1 0 1 0 1 0
      v.5z"
            />
          </defs>
          <g>
            <use
              href="#w"
              y=".0"
              fill="none"
              stroke="black"
              stroke-width="0.005"
            />
            <use href="#w" y=".1" fill="#00000018" />
            <use
              href="#w"
              y=".2"
              fill="none"
              stroke="black"
              stroke-width="0.008"
            />
          </g>
        </svg>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Hello, {user?.name || "user"}</h2>
            {categories.slice(0, 3).map((category, index) => (
        <div key={category.id} className="mb-4 bg-white p-4 rounded shadow">
          <label className="block mb-2 font-medium">
            Naziv kategorije {index + 1}
          </label>
          <input
            type="text"
            value={category.name}
            onChange={(e) =>
              handleChange(index, "name", e.target.value)
            }
            placeholder={`Unesi naziv kategorije`}
            className="w-full p-2 border border-gray-300 rounded mb-3"
          />

          <label className="block mb-2 font-medium">Boja</label>
          <select
            value={category.color}
            onChange={(e) =>
              handleChange(index, "color", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Izaberi boju</option>
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      ))}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
