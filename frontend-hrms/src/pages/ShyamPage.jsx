// ShyamPage.jsx
import { useEffect, useState } from "react";
import api from "../api"; // your axios instance

export default function ShyamPage() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    api.get("/shyam")
      .then((res) => {
        setMessage(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Error calling API");
      });
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}