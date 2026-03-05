import db from "../config/db.js";

export const addHoliday = (req,res) => {

  const { title, holiday_date, description } = req.body;

  db.query(
    "INSERT INTO holidays (title,holiday_date,description) VALUES (?,?,?)",
    [title,holiday_date,description],
    (err,result)=>{
      if(err) return res.status(500).json(err);

      res.json({message:"Holiday added"});
    }
  );
};


export const getHolidays = (req,res)=>{

  db.query(
    "SELECT * FROM holidays ORDER BY holiday_date ASC",
    (err,result)=>{
      if(err) return res.status(500).json(err);

      res.json(result);
    }
  );

};


export const updateHoliday = (req,res)=>{

  const id = req.params.id;
  const { title,holiday_date,description } = req.body;

  db.query(
    "UPDATE holidays SET title=?,holiday_date=?,description=? WHERE id=?",
    [title,holiday_date,description,id],
    (err)=>{
      if(err) return res.status(500).json(err);

      res.json({message:"Holiday updated"});
    }
  );
};


export const deleteHoliday = (req,res)=>{

  const id = req.params.id;

  db.query(
    "DELETE FROM holidays WHERE id=?",
    [id],
    (err)=>{
      if(err) return res.status(500).json(err);

      res.json({message:"Holiday deleted"});
    }
  );

};
