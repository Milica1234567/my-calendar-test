import { useEffect, useState } from "react";
import defaultAvatar from "../assets/avatars/defaultAvatar.png";
import AvatarSelector from "./AvatarSelector";
import { TwitterPicker } from "react-color";

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

const colorPalettes = {
  Pastel: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#E0BBE4"],
  Vibrant: ["#FF6B6B", "#F7B32B", "#6BCB77", "#4D96FF", "#9B5DE5", "#FF8FAB"],
  Productivity: [
    "#264653",
    "#2A9D8F",
    "#E9C46A",
    "#F4A261",
    "#E76F51",
    "#8AB17D",
  ],
};

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

  const [color, setColor] = useState("#ff0000");
  const [selectedPalette, setSelectedPalette] = useState();

  return (
    <div
      className="settings-container"
      style={{
        width: "60%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection:"column"
      }}
    >
      <div
        className="profile-settings"
        style={{
          borderRadius: "16px",
          border: "1px solid #c4c4c4",
          width: "100%",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h2>Profile settings</h2>

        <select
          value={selectedPalette}
          onChange={(e) => setSelectedPalette(e.target.value)}
        >
          <option value="">Izaberi paletu</option>
          {Object.keys(colorPalettes).map((palette) => (
            <option key={palette} value={palette}>
              {palette}
            </option>
          ))}
        </select>
      </div>

      <div
        className="cattegories-settings"
        style={{
          borderRadius: "16px",
          border: "1px solid #c4c4c4",
          width: "100%",
          padding: "20px",
        }}
      >
        <h2 style={{ margin: "0 0 20px 0" }}>Category settings</h2>
        <div>
          <p>
            <strong>Default category:</strong> <span>Other</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          {categories.slice(0, 3).map((category, index) => (
            <div
              className="category"
              key={category.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: category.color || "#f3f4f6",
                padding: "20px 8px",
                borderRadius: "8px",
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
                className="category-input"
              />

              <TwitterPicker
                triangle="hide"
                colors={colorPalettes[selectedPalette] || []}
                color={color}
                onChangeComplete={(newColor) => {
                  setColor(newColor.hex);
                  handleChange(index, "color", newColor.hex);
                }}
              />
            </div>
          ))}
        </div>

        <button className="button-style" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
