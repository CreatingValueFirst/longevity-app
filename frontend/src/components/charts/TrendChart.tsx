'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { cn } from '@/lib/utils';

interface DataPoint {
  date: string;
  value: number | null;
  [key: string]: string | number | null;
}

interface TrendChartProps {
  data: DataPoint[];
  dataKey?: string;
  color?: string;
  fillColor?: string;
  showGrid?: boolean;
  showAxis?: boolean;
  height?: number;
  className?: string;
  type?: 'line' | 'area';
  gradientId?: string;
}

export function TrendChart({
  data,
  dataKey = 'value',
  color = '#3b82f6',
  showGrid = true,
  showAxis = true,
  height = 200,
  className,
  type = 'line',
  gradientId = 'colorGradient',
}: TrendChartProps) {
  // Filter out null values for display
  const filteredData = data.filter((d) => d[dataKey] !== null);

  if (filteredData.length === 0) {
    return (
      <div className={cn('flex items-center justify-center text-muted-foreground', className)} style={{ height }}>
        No data available
      </div>
    );
  }

  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={filteredData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          {type === 'area' && (
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}

          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
          )}

          {showAxis && (
            <>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                width={30}
              />
            </>
          )}

          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
            }}
          />

          {type === 'area' ? (
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          ) : (
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}

// Sparkline component for compact trend display
interface SparklineProps {
  data: (number | null)[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  data,
  color = '#3b82f6',
  width = 80,
  height = 24,
  className,
}: SparklineProps) {
  const filteredData = data
    .map((value, index) => ({ index, value }))
    .filter((d) => d.value !== null);

  if (filteredData.length < 2) return null;

  return (
    <div className={cn('', className)} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
