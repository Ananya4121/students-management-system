import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function StudentsTable() {
  // Initialize with empty array or load from localStorage if available
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.email || !form.age) {
      alert("All fields required");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(form.email)) {
      alert("Invalid Email");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      if (editIndex !== null) {
        // Update existing student
        const updatedStudents = [...students];
        updatedStudents[editIndex] = { ...form, id: students[editIndex].id || Date.now() };
        setStudents(updatedStudents);
        setEditIndex(null);
      } else {
        // Add new student
        const newStudent = {
          ...form,
          id: Date.now(), // Generate unique ID
        };
        setStudents([...students, newStudent]);
      }

      setForm({ name: "", email: "", age: "" });
      setLoading(false);
    }, 500); // Simulated loading delay
  };

  const handleEdit = (index) => {
    setForm(students[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete?")) {
      // Remove student from array
      const updatedStudents = students.filter((_, i) => i !== index);
      setStudents(updatedStudents);
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "students.xlsx");
  };

  return (
    <div className="container mt-4">
      <h2>Students Table</h2>

      {/* Simulated Loading */}
      {loading && <p>Loading...</p>}

      <div>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {editIndex !== null ? "Update" : "Add Student"}
        </button>

        <button onClick={downloadExcel}>Download Excel</button>
      </div>

      <table border="1" width="100%" className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                No students added yet. Add a student to get started!
              </td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr key={student.id || index}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.age}</td>

                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentsTable;
