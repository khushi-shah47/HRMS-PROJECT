# Dark Mode Full App Implementation - Remaining Fixes

## Current Status
✅ Layout.jsx, Topbar.jsx, Sidebar.jsx updated  
❌ Navbar, pagination headers, attendance page, role-based dashboards, layout cards still broken  

## Steps to Complete

### Phase 1: Core Fixes (AdminDashboard + Attendance)
✅ **Step 1**: Update AdminDashboard.jsx - replace hardcoded light colors with theme-aware sx props  
✅ **Step 2**: Fix AllAttendancePage.jsx table headers (remove #f5f5f5 → theme action.hover)  
✅ **Step 3**: Update AttendancePage.jsx - remove light gradients, use background.paper    
✅ **Step 4**: Update StatsCards.jsx - make icons theme-aware (primary.main)

### Phase 2: Role-Based Dashboards
- [ ] **Step 5**: Update HRDashboard.jsx, ManagerDashboard.jsx, DeveloperDashboard.jsx, InternDashboard.jsx (same pattern)
- [ ] **Step 6**: Search for remaining hardcoded colors (#F8FAFC, #f5f5f5, #EBF5FF) and fix

### Phase 3: Test & Complete
- [ ] **Step 7**: Test toggle across app (navbar, pagination, attendance, dashboards, cards, scrollbars)
- [ ] **Step 8**: Verify skyblue (#60A5FA) white text in dark mode
- [ ] **Step 9**: `attempt_completion`

**Next**: Step 1 - AdminDashboard.jsx

**Progress**: 0/9 complete

