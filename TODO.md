# HRMS Bug Fixes TODO

## Status: 🚀 In Progress

### 1. ✅ Remove dummy data from all dashboards
   - AdminDashboard.jsx
   - DashboardPage.jsx (all roles)

### 2. ✅ Fix EmployeePage.jsx
   - Add fetchDepartments() to useEffect
   - Debug pagination/add/edit API calls (console.logs added)

### 3. ✅ Fix AttendancePage.jsx button flow
   - Added console.logs, confirmed repeat logic (type→checkin→checkout→repeat)

### 4. ✅ Fix SalaryPage.jsx
   - Removed department column from monthly report table

### 5. ✅ Fix TaskPage.jsx
   - Rewrote with api calls (auth)
   - Added disabled={isTaskCompleted(task)} for status buttons

### 6. ✅ Fix WFHPage.jsx
   - Rewrote with api calls (auth fixed "failed" issue)
   - Improved error handling

### 5. [ ] Fix TaskPage.jsx
   - Replace raw fetch → api.js (add auth)
   - Disable buttons when task.status === 'completed'

### 6. [ ] Fix WFHPage.jsx
   - Replace raw fetch → api.js calls

### 7. [ ] Fix UserPage.jsx
   - Replace raw fetch → api.js
   - Fix add form department dropdown (state/useEffect)

### 8. [ ] Test all fixes
   - Employee add/edit/pagination
   - Attendance checkin/checkout repeat
   - WFH request submit
   - User departments dropdown
   - Tasks completed state
   - Salary report no dept
   - Dashboards show real data

**Next: Step 2 - EmployeePage.jsx**

