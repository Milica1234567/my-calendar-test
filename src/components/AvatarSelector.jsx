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
    <div ref={dropdownRef} style={{cursor:"pointer"}} >
      <div onClick={() => setOpen(!open)}>
        {selectedAvatar ? (
          <div className="avatar-container">
            <img src={selectedAvatar} alt="avatar" />
          </div>
        ) : (
          <div className="avatar-container">
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
          }}
        >
          {avatarImages.map((img, index) => (
            <div className="avatar-container">
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
          <h1>test</h1>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
