import React, { useState, useRef, useEffect } from "react";
import work from "../assets/avatars/briefcase.png";
import home from "../assets/avatars/home (1).png";
import book from "../assets/avatars/book.png";
import defaultAvatar from "../assets/avatars/defaultAvatar.png";

const avatarImages = [work, home, book, defaultAvatar];

const AvatarDropdown = ({ selectedAvatar, onSelect }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ cursor: "pointer" }}>
      <div onClick={() => setOpen(!open)}>
        {selectedAvatar ? (
          <div
            className="avatar-container-main"
            style={{
              background: "#ffffff",
              borderRadius: "50%",
              padding: "12px",
            }}
          >
            <img src={selectedAvatar} alt="avatar" />
          </div>
        ) : (
          <div className="avatar-container-main">
            <img src={defaultAvatar} alt="" />
          </div>
        )}
      </div>

      {open && (
        <div
          className="dropdown-avatar"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 50px)",
            gap: "10px",
            padding: "10px",
            position:"absolute",
            background:"#c4c4c4",
            zIndex:"1000",
            borderRadius:"16px",
            marginTop:"8px",
            transform: "translateX(-30%) scale(1)",
          }}
        >
          {avatarImages.map((img, index) => (
            <div
              className="avatar-container"
              style={{ borderRadius: "50%", background: "#ffffff" }}
            >
              <img
                key={index}
                src={img}
                alt={`avatar-${index}`}
                onClick={() => {
                  onSelect(img);
                  setOpen(false);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
