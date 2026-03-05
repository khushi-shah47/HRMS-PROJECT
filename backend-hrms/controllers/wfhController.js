import db from "../config/db.js";


export const applyWFH = (req,res) => {

  const { employee_id, start_date, end_date, reason } = req.body;

  if(!employee_id || !start_date || !end_date){
    return res.status(400).json({ message:"Missing required fields"});
  }

  db.query(
    "INSERT INTO wfh_requests (employee_id,start_date,end_date,reason) VALUES (?,?,?,?)",
    [employee_id,start_date,end_date,reason],
    (err,result)=>{
      if(err) return res.status(500).json(err);

      res.json({
        message:"WFH request submitted",
        status:"pending"
      });
    }
  );
};



export const approveWFH = (req,res)=>{

  const { id } = req.body;

  db.query(
    "UPDATE wfh_requests SET manager_approval='approved',status='approved' WHERE id=?",
    [id],
    (err)=>{
      if(err) return res.status(500).json(err);

      res.json({message:"WFH Approved"});
    }
  );
};



export const rejectWFH = (req,res)=>{

  const { id } = req.body;

  db.query(
    "UPDATE wfh_requests SET manager_approval='rejected',status='rejected' WHERE id=?",
    [id],
    (err)=>{
      if(err) return res.status(500).json(err);

      res.json({message:"WFH Rejected"});
    }
  );
};



export const getWFHHistory = (req,res)=>{

  const employeeId = req.params.employee_id;

  db.query(
    `SELECT w.*,e.name
     FROM wfh_requests w
     JOIN employees e ON w.employee_id=e.id
     WHERE w.employee_id=?
     ORDER BY w.start_date DESC`,
    [employeeId],
    (err,result)=>{
      if(err) return res.status(500).json(err);

      res.json(result);
    }
  );
};



export const getAllWFH = (req,res)=>{

  db.query(
    `SELECT w.*,e.name
     FROM wfh_requests w
     JOIN employees e ON w.employee_id=e.id
     ORDER BY w.start_date DESC`,
    (err,result)=>{
      if(err) return res.status(500).json(err);

      res.json(result);
    }
  );
};
