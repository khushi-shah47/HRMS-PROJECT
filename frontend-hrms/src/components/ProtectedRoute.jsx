import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Role-based route access configuration
const roleAccess = {
  admin: [
    "/",
    "/employees",
    "/attendance",
    "/all-attendance",
    "/tasks",
    "/reports",
    "/users",
    "/leave",
    "/salary",
    "/policies",
    "/wfh",
    "/holidays",
    "/departments"
  ],
  manager: [
    "/",
    "/employees",
    "/attendance",
    "/tasks",
    "/reports",
    "/leave",
    "/wfh",
    "/departments"
  ],
  hr: [
    "/",
    "/employees",
    "/attendance",
    "/leave",
    "/holidays",
    "/departments"
  ],
  developer: [
    "/",
    "/attendance",
    "/leave",
    "/tasks",
    "/wfh"
  ],
  intern: [
    "/",
    "/attendance",
    "/tasks"
  ]
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const location = useLocation();

  // Check if user is logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is specified, check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userData) {
      return <Navigate to="/login" />;
    }

    const user = JSON.parse(userData);
    const userRole = user.role;

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(userRole)) {
      // Redirect to their role-specific dashboard
      return <Navigate to={`/${userRole}`} />;
    }
  }

  return children;
}

// Helper function to check if a path is accessible for a role
export function hasAccess(role, path) {
  const accessiblePaths = roleAccess[role] || [];
  
  // Exact match or root path
  if (accessiblePaths.includes(path) || path === `/${role}`) {
    return true;
  }
  
  // Check if path starts with any accessible route
  return accessiblePaths.some(accessiblePath => 
    path.startsWith(accessiblePath) && accessiblePath !== "/"
  );
}

// Get dashboard route for a specific role
export function getDashboardRoute(role) {
  const dashboards = {
    admin: "/admin",
    manager: "/manager",
    hr: "/hr",
    developer: "/developer",
    intern: "/intern"
  };
  return dashboards[role] || "/";
}

