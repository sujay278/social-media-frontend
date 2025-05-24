import React, { useState } from "react";
import axios from "axios";
import './SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.includes('@')) newErrors.email = "Invalid email";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8989/katta/auth/signup', formData);
      alert("Registration Successful!");
      console.log(response.data);
    } catch (error) {
      console.error("Error Registring user:", error);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="SingUp-container">
      <h2>SingUp</h2>
      <form onSubmit={handleSubmit} className="SingUp-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <span className="error">{errors.username}</span>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "SingUping..." : "SingUp"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
