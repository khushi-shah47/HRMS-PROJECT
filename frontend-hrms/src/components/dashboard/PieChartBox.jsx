// components/dashboard/PieChartBox.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@mui/material";

export default function PieChartBox({ data }) {
  const theme = useTheme();
  const COLORS = [
    theme.palette.primary.main, 
    theme.palette.success.main, 
    theme.palette.warning.main, 
    theme.palette.error.main, 
    theme.palette.secondary.main
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" outerRadius={80}>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}