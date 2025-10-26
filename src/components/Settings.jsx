import { useEffect, useState } from "react";
import defaultAvatar from "../assets/avatars/defaultAvatar.png";
import AvatarSelector from "./AvatarSelector";

const defaultCategory = {
  name: "Ostalo",
  color: "#000000",
  id: "default",
  avatar: defaultAvatar, // dodaj default avatar
};

const initialCategories = [
  { name: "", color: "", avatar: "", id: "custom-1" },
  { name: "", color: "", avatar: "", id: "custom-2" },
  { name: "", color: "", avatar: "", id: "custom-3" },
];

const colorOptions = [
  { name: "Crvena", value: "#ef4444" },
  { name: "Plava", value: "#3b82f6" },
  { name: "Zelena", value: "#10b981" },
  { name: "Žuta", value: "#facc15" },
  { name: "Ljubičasta", value: "#a855f7" },
  { name: "Narandžasta", value: "#f97316" },
];

export default function CategorySettings() {
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

  const handleSelectAvatar = (index, selectedAvatar) => {
    const updated = [...categories];
    updated[index].avatar = selectedAvatar;
    setCategories(updated);
  };

  return (
    <div className="settings-container">
      <div className="profile-settings">
        <h2>Profile settings</h2>
      </div>

      <div className="cattegories-settings">
        <h2>Category settings</h2>

        {categories.slice(0, 3).map((category, index) => (
          <div
            className="category"
            key={category.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              backgroundColor: category.color || "#f3f4f6",
            }}
          >
            <AvatarSelector
              selectedAvatar={category.avatar || defaultAvatar}
              onSelect={(img) => handleSelectAvatar(index, img)}
            />

            <input
              type="text"
              value={category.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              placeholder="Kategorija"
            />

            <select
              value={category.color}
              onChange={(e) => handleChange(index, "color", e.target.value)}
            >
              <option value="">Color</option>
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <p>
            <strong>Default kategorija:</strong> <span>Ostalo</span>
          </p>
        </div>

        <button onClick={handleReset}>Resetuj kategorije</button>
      </div>
    </div>
  );
}
