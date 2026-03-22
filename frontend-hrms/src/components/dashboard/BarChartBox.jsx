// components/dashboard/BarChartBox.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@mui/material";

export default function BarChartBox({ data }) {
  const theme = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill={theme.palette.primary.light} />
      </BarChart>
    </ResponsiveContainer>
  );
}