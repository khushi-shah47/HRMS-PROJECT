import db from "../config/db.js";

export const addPolicy = (req,res)=>{

const {title,description} = req.body;

db.query(
"INSERT INTO policies (title,description) VALUES (?,?)",
[title,description],
(err)=>{
if(err) return res.status(500).json(err);

res.json({message:"Policy added"});
}
);

};

export const getPolicies = (req,res)=>{

db.query(
"SELECT * FROM policies",
(err,result)=>{
if(err) return res.status(500).json(err);

res.json(result);
}
);

};

export const deletePolicy = (req,res)=>{

const id = req.params.id;

db.query(
"DELETE FROM policies WHERE id=?",
[id],
(err)=>{
if(err) return res.status(500).json(err);

res.json({message:"Deleted"});
}
);

};