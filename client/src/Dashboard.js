import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get('http://localhost:5555/submissions');
        setSubmissions(res.data);
      } catch (err) {
        console.error('Failed to fetch submissions', err);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Resume Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Authorized</th>
                <th>Cover Letter</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((applicant) => (
                <tr key={applicant._id}>
                  <td>{applicant.firstName} {applicant.lastName}</td>
                  <td>{applicant.email}</td>
                  <td>{applicant.phone}</td>
                  <td>{applicant.address}</td>
                  <td>{applicant.authorized ? 'Yes' : 'No'}</td>
                  <td>{applicant.coverLetter || '-'}</td>
                  <td>
                    <a
                      href={`http://localhost:5555/resume/${applicant.resumeFileId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
