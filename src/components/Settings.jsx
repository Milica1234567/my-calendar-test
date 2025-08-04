import { useEffect, useState } from "react";

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

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Podešavanje kategorija</h2>

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

      <div className="mt-6 p-4 border-t pt-4 text-sm text-gray-700">
        <p>
          <strong>Podrazumevana kategorija:</strong> <span className="ml-2 text-black">Ostalo</span>
        </p>
      </div>

      <button
        onClick={handleReset}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Resetuj kategorije
      </button>
    </div>
  );
}
