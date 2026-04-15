import db from "../config/db.js";
import { createNotification } from "./notificationController.js";

export const getAnnouncements = (req, res) => {
  const sql = `
    SELECT a.*, u.username as author_name, u.role as author_role
    FROM announcements a
    LEFT JOIN users u ON a.created_by = u.id
    ORDER BY a.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("GET Announcements Error:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.json(result);
  });
};

/* Create Announcement */
export const createAnnouncement = (req, res) => {
  const { title, content } = req.body;
  const createdBy = req.user.id;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Announcement title is required" });
  }

  if (!createdBy) {
    return res.status(401).json({ message: "Unauthorized: User information missing" });
  }

  const sql = "INSERT INTO announcements (title, content, created_by) VALUES (?, ?, ?)";

  db.query(sql, [title.trim(), content ? content.trim() : null, createdBy], (err, result) => {
    if (err) {
      console.error("Error creating announcement:", err);
      return res.status(500).json({ 
        message: "Failed to create announcement", 
        error: err.message,
        code: err.code 
      });
    }
    res.status(201).json({ 
      message: "Announcement posted successfully", 
      id: result ? result.insertId : null 
    });

    // Notify all employees about the new announcement
    db.query("SELECT id FROM employees", (err, employees) => {
      if (!err && employees.length > 0) {
        employees.forEach(emp => {
          createNotification(emp.id, "New Announcement", `A new announcement has been posted: ${title.trim()}`, "announcement").catch(console.error);
        });
      }
    });

  });
};

/* Delete Announcement */
export const deleteAnnouncement = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Announcement ID is required" });
  }

  db.query("DELETE FROM announcements WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting announcement:", err);
      return res.status(500).json({ 
        message: "Failed to delete announcement", 
        error: err.message,
        code: err.code 
      });
    }
    
    if (result && result.affectedRows === 0) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.json({ message: "Announcement deleted successfully" });
  });
};
