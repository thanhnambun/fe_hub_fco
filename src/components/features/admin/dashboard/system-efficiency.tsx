"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const efficiencyData = [
  { time: "00:00", load: 35 },
  { time: "04:00", load: 42 },
  { time: "08:00", load: 68 },
  { time: "12:00", load: 85 },
  { time: "16:00", load: 72 },
  { time: "20:00", load: 55 },
  { time: "23:59", load: 38 },
];

export function SystemEfficiency() {
  return (
    <div className="glass-effect p-8 rounded-xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
              System Efficiency Metric
            </h3>
            <p className="text-sm text-muted-foreground">24-hour server load analysis</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-serif font-bold text-primary">72%</p>
            <p className="text-xs text-muted-foreground">Average Load</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={efficiencyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3240" />
              <XAxis dataKey="time" stroke="#a0a8b3" style={{ fontSize: "12px" }} />
              <YAxis stroke="#a0a8b3" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1f2e",
                  border: "1px solid #d4af37",
                  borderRadius: "8px",
                }}
                cursor={{ stroke: "#d4af37", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="load"
                stroke="#d4af37"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLoad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Peak Load</p>
            <p className="text-lg font-semibold text-primary">85%</p>
            <p className="text-xs text-muted-foreground">12:00 PM</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg Response</p>
            <p className="text-lg font-semibold text-foreground">142ms</p>
            <p className="text-xs text-muted-foreground">Optimal</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Uptime</p>
            <p className="text-lg font-semibold text-accent">99.9%</p>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
