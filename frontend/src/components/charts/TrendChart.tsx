'use client';

import { useState, useEffect } from 'react';
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
  mobileHeight?: number;
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
  mobileHeight = 180,
  className,
  type = 'line',
  gradientId = 'colorGradient',
}: TrendChartProps) {
  // Track if component is mounted to avoid SSR hydration issues with Recharts
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if mobile on mount and resize
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter out null values for display
  const filteredData = data.filter((d) => d[dataKey] !== null);

  // Use appropriate height based on screen size
  const chartHeight = isMobile ? mobileHeight : height;

  if (filteredData.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center text-muted-foreground', className)}
        style={{ height: chartHeight, minHeight: chartHeight }}
      >
        No data available
      </div>
    );
  }

  // Don't render chart until mounted to avoid SSR width/height -1 warnings
  if (!isMounted) {
    return (
      <div
        className={cn('w-full flex items-center justify-center bg-muted/20 rounded-lg animate-shimmer', className)}
        style={{ height: chartHeight, minHeight: chartHeight }}
      >
        <div className="text-muted-foreground text-sm">Loading chart...</div>
      </div>
    );
  }

  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  // Generate unique gradient ID to avoid conflicts between multiple charts
  const uniqueGradientId = `${gradientId}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('w-full touch-pan-x', className)} style={{ height: chartHeight, minHeight: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={chartHeight}>
        <ChartComponent
          data={filteredData}
          margin={{ top: 5, right: 10, left: isMobile ? -15 : 0, bottom: 5 }}
        >
          {type === 'area' && (
            <defs>
              <linearGradient id={uniqueGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}

          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} vertical={!isMobile} />
          )}

          {showAxis && (
            <>
              <XAxis
                dataKey="date"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
                interval={isMobile ? 'preserveStartEnd' : 'equidistantPreserveStart'}
                minTickGap={isMobile ? 40 : 30}
              />
              <YAxis
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                width={isMobile ? 35 : 40}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                  return value;
                }}
              />
            </>
          )}

          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
              padding: '8px 12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
            }}
            cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
          />

          {type === 'area' ? (
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#${uniqueGradientId})`}
              dot={false}
              activeDot={{ r: isMobile ? 6 : 5, fill: color, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
            />
          ) : (
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: isMobile ? 6 : 5, fill: color, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
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
  // Track if component is mounted to avoid SSR hydration issues
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredData = data
    .map((value, index) => ({ index, value }))
    .filter((d) => d.value !== null);

  if (filteredData.length < 2) return null;

  // Don't render chart until mounted to avoid SSR width/height -1 warnings
  if (!isMounted) {
    return (
      <div
        className={cn('bg-muted/30 rounded animate-pulse', className)}
        style={{ width, height, minWidth: width, minHeight: height }}
      />
    );
  }

  return (
    <div
      className={cn('', className)}
      style={{ width, height, minWidth: width, minHeight: height }}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={width} minHeight={height}>
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
