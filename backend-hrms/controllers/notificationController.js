import db from "../config/db.js";

// Helper function to create a notification (can be called from other controllers)
// Accepts employeeId, resolves it to userId, and inserts into DB
export const createNotification = (employeeId, title, message, type) => {
  return new Promise((resolve, reject) => {
    // 1. Resolve employeeId to userId (Clean Architecture)
    db.query(
      "SELECT user_id FROM employees WHERE id = ?",
      [employeeId],
      (err, results) => {
        if (err) {
          console.error("Error resolving userId for notification:", err);
          return reject(err);
        }
        if (results.length === 0) {
          console.error(`Employee ID ${employeeId} not found for notification.`);
          return reject(new Error("Employee not found"));
        }

        const userId = results[0].user_id;

        // 2. Insert using reconciled userId
        db.query(
          "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
          [userId, title, message, type],
          (err, result) => {
            if (err) {
              console.error("Error inserting notification:", err);
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      }
    );
  });
};

export const getMyNotifications = (req, res) => {
  const userId = req.user.id;   // notifications.user_id → users.id

  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(result);
    }
  );
};

export const getUnreadCount = (req, res) => {
  const userId = req.user.id;   // notifications.user_id → users.id

  db.query(
    "SELECT COUNT(*) as unreadCount FROM notifications WHERE user_id = ? AND is_read = FALSE",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ unreadCount: result[0].unreadCount });
    }
  );
};

export const markAsRead = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;   // notifications.user_id → users.id

  db.query(
    "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
    [id, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "Notification marked as read" });
    }
  );
};

export const markAllAsRead = (req, res) => {
  const userId = req.user.id;   // notifications.user_id → users.id

  db.query(
    "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "All notifications marked as read" });
    }
  );
};
