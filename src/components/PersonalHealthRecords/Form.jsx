import { useState } from "react";

function Form({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodType: "",
    allergies: "",
    notes: "",
    profilePic: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age) {
      alert("Please fill in all required fields.");
      return;
    }
    onAdd(formData);
    setFormData({ name: "", age: "", bloodType: "", allergies: "", notes: "", profilePic: null });
  };

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      <h3>Add Health Record</h3>
      <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
      <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
      <input type="text" name="bloodType" placeholder="Blood Type (Optional)" onChange={handleChange} />
      <input type="text" name="allergies" placeholder="Allergies (Optional)" onChange={handleChange} />
      <textarea name="notes" placeholder="Doctor's Notes" onChange={handleChange}></textarea>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button type="submit">Add Record</button>
    </form>
  );
}

export default Form;
