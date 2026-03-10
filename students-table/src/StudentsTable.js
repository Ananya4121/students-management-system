import React, { useMemo, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function StudentsTable() {
  // Initialize with empty array or load from localStorage if available
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null); // { type: 'success' | 'danger', message: string }

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setBanner(null);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required.";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!emailPattern.test(form.email.trim()))
      nextErrors.email = "Enter a valid email address.";

    const ageValue = Number(form.age);
    if (form.age === "" || form.age === null || form.age === undefined)
      nextErrors.age = "Age is required.";
    else if (!Number.isFinite(ageValue) || ageValue <= 0)
      nextErrors.age = "Age must be a positive number.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      if (editIndex !== null) {
        // Update existing student
        const updatedStudents = [...students];
        updatedStudents[editIndex] = {
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          age: String(form.age).trim(),
          id: students[editIndex].id || Date.now(),
        };
        setStudents(updatedStudents);
        setEditIndex(null);
        setBanner({ type: "success", message: "Student updated successfully." });
      } else {
        // Add new student
        const newStudent = {
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          age: String(form.age).trim(),
          id: Date.now(), // Generate unique ID
        };
        setStudents([...students, newStudent]);
        setBanner({ type: "success", message: "Student added successfully." });
      }

      setForm({ name: "", email: "", age: "" });
      setLoading(false);
    }, 500); // Simulated loading delay
  };

  const handleEdit = (index) => {
    setForm(students[index]);
    setEditIndex(index);
    setErrors({});
    setBanner(null);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete?")) {
      // Remove student from array
      const updatedStudents = students.filter((_, i) => i !== index);
      setStudents(updatedStudents);
      setBanner({ type: "success", message: "Student deleted." });
    }
  };

  const handleCancelEdit = () => {
    setForm({ name: "", email: "", age: "" });
    setEditIndex(null);
    setErrors({});
    setBanner(null);
  };

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const haystack = `${s.name ?? ""} ${s.email ?? ""} ${s.age ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [students, query]);

  const downloadExcel = () => {
    const rowsToExport = filteredStudents.map(({ id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(rowsToExport);
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
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
        <div>
          <h2 className="mb-1">Students</h2>
          <div className="text-muted small">
            Frontend-only CRUD • Saved in your browser (localStorage)
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-secondary">
            Total: {students.length}
          </span>
          <span className="badge text-bg-info">
            Showing: {filteredStudents.length}
          </span>
        </div>
      </div>

      {/* Simulated Loading */}
      {banner && (
        <div className={`alert alert-${banner.type} py-2`} role="alert">
          {banner.message}
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="card-title mb-0">
                  {editIndex !== null ? "Edit student" : "Add student"}
                </h5>
                {loading && (
                  <span className="badge text-bg-warning">Saving…</span>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  placeholder="e.g. Alex Johnson"
                  value={form.name}
                  onChange={handleChange}
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  disabled={loading}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  placeholder="e.g. alex@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  disabled={loading}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Age</label>
                <input
                  name="age"
                  placeholder="e.g. 20"
                  value={form.age}
                  onChange={handleChange}
                  className={`form-control ${errors.age ? "is-invalid" : ""}`}
                  disabled={loading}
                  inputMode="numeric"
                />
                {errors.age && (
                  <div className="invalid-feedback">{errors.age}</div>
                )}
              </div>

              <div className="d-flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary flex-grow-1"
                  disabled={loading}
                >
                  {editIndex !== null ? "Update Student" : "Add Student"}
                </button>

                {editIndex !== null && (
                  <button
                    onClick={handleCancelEdit}
                    className="btn btn-outline-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <hr className="my-4" />

              <button
                onClick={downloadExcel}
                className="btn btn-outline-success w-100"
                disabled={filteredStudents.length === 0}
              >
                Download Excel ({filteredStudents.length})
              </button>
              <div className="text-muted small mt-2">
                Exports the currently visible (filtered) rows.
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
                <div className="input-group">
                  <span className="input-group-text">Search</span>
                  <input
                    className="form-control"
                    placeholder="Filter by name, email, or age…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuery("")}
                    disabled={!query}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "28%" }}>Name</th>
                      <th style={{ width: "38%" }}>Email</th>
                      <th style={{ width: "12%" }}>Age</th>
                      <th style={{ width: "22%" }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          {students.length === 0
                            ? "No students yet. Add your first student on the left."
                            : "No matches. Try a different search."}
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => {
                        const originalIndex = students.findIndex(
                          (s) => (s.id || s.email) === (student.id || student.email)
                        );

                        return (
                          <tr key={student.id || student.email}>
                            <td className="fw-semibold">{student.name}</td>
                            <td className="text-muted">{student.email}</td>
                            <td>{student.age}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(originalIndex)}
                                  disabled={loading}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(originalIndex)}
                                  disabled={loading}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentsTable;
