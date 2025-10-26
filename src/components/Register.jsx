import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendWelcomeEmail = (userEmail, userName) => {
    emailjs
      .send(
        "service_d6r2bnl",
        "template_7nbosep",
        { user_email: userEmail, user_name: userName },
        "0Opsb8UOhI3HKOeMl"
      )
      .then(() => {
        console.log("Mejl poslat!");
      })
      .catch((error) => {
        console.error("Greška pri slanju mejla:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(formData));
    sendWelcomeEmail(formData.email, formData.name);
    navigate("/dashboard");
  };

  return (
    <div className="register-container">
      <div className="card-holder-blur">
        <h2>Register here</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="waves">
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
    </div>
  );
}

export default Register;
