import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function ResumeForm() {
  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    coverLetter: '',
    authorized: '',
  };

  const [formData, setFormData] = useState(initialFormState);
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
      await axios.post('http://localhost:5555/submit', submissionData);
      alert('Resume submitted!');
      setFormData(initialFormState);
      setResume(null);
      e.target.reset();
    } catch (err) {
      if (err.response?.status === 409) {
        alert('You’ve already submitted a resume with this email or phone number.');
      } else {
        alert('Error submitting resume.');
      }
    }

  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Resume Submission Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name*</label>
          <input name="firstName" className="form-control" required onChange={handleChange} value={formData.firstName} />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name*</label>
          <input name="lastName" className="form-control" required onChange={handleChange} value={formData.lastName} />
        </div>

        <div className="mb-3">
          <label className="form-label">Email*</label>
          <input name="email" type="email" className="form-control" required onChange={handleChange} value={formData.email} />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone*</label>
          <input name="phone" className="form-control" required onChange={handleChange} value={formData.phone} />
        </div>

        <div className="mb-3">
          <label className="form-label">Address*</label>
          <input name="address" className="form-control" required onChange={handleChange} value={formData.address} />
        </div>

        <div className="mb-3">
          <label className="form-label">Cover Letter</label>
          <textarea name="coverLetter" className="form-control" rows="4" onChange={handleChange} value={formData.coverLetter}></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Are you authorized to work in the US without sponsorship?*</label>
          <select name="authorized" className="form-select" required onChange={handleChange} value={formData.authorized}>
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Resume*</label>
          <input type="file" name="resume" className="form-control" required onChange={handleFileChange} />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default ResumeForm;
