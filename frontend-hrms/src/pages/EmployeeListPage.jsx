import { useEffect, useState } from "react";

function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [sort, setSort] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const perPage = 10;

  useEffect(() => {
    const queryParams = new URLSearchParams({
      page,
      limit: perPage,
      department,
      search,
      sort
    });

    fetch(`/api/employees?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        setEmployees(data.data);
        setTotalPages(data.totalPages);
      })
      .catch(err => console.error(err));
  }, [page, department, search, sort]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [department, search, sort]);

  return (
    <div>
      <h2>Employees</h2>

      {/* Filters */}
      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="">All Departments</option>
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Developer">Developer</option>
          <option value="Intern">Intern</option>
        </select>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="id">ID</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>
      </div>

      {/* Employee Table */}
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default EmployeeListPage;