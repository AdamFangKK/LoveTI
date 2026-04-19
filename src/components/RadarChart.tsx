import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ChartData {
  labels: string[];
  values: number[];
  maxValue: number;
}

const COLORS = ['#FFB4A2', '#FF8C42', '#7EB77F', '#4A90D9'];

export default function RadarChartComponent({ data }: { data: ChartData }) {
  const chartData = data.labels.map((label, i) => ({
    subject: label,
    value: data.values[i],
    fullMark: data.maxValue,
  }));

  return (
    <div className="w-64 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="rgba(0,0,0,0.1)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <Radar
            name="维度分布"
            dataKey="value"
            stroke={COLORS[0]}
            fill={COLORS[0]}
            fillOpacity={0.4}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
