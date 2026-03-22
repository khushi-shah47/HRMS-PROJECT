// components/dashboard/LineChartBox.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@mui/material";

export default function LineChartBox({ data }) {
  const theme = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}