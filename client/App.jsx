import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    coverLetter: '',
    authorized: '',
  });
  const [resume, setResume] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      submissionData.append(key, formData[key]);
    });
    submissionData.append('resume', resume);

    try {
      await axios.post('http://localhost:5000/submit', submissionData);
      alert('Resume submitted!');
    } catch (err) {
      alert('Error submitting resume.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="First Name*" required onChange={handleChange} />
      <input name="lastName" placeholder="Last Name*" required onChange={handleChange} />
      <input name="email" type="email" placeholder="Email*" required onChange={handleChange} />
      <input name="phone" placeholder="Phone*" required onChange={handleChange} />
      <input name="address" placeholder="Address*" required onChange={handleChange} />
      <textarea name="coverLetter" placeholder="Cover Letter" onChange={handleChange}></textarea>
      <label>
        Authorized to work in the US without sponsorship?*
        <select name="authorized" required onChange={handleChange}>
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <input type="file" name="resume" required onChange={handleFileChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
