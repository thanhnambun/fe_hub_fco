'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const queueData = [
  { name: 'Processing', value: 24, fill: '#d4af37' },
  { name: 'Queued', value: 18, fill: '#a89968' },
  { name: 'Completed', value: 42, fill: '#c9a961' },
]

export function RestorationQueue() {
  return (
    <div className="glass-effect p-8 rounded-xl h-full flex flex-col">
      <div className="space-y-6 flex-1 flex flex-col">
        {/* Header */}
        <div>
          <h3 className="text-xl font-serif font-bold text-foreground mb-2">
            Restoration Queue
          </h3>
          <p className="text-sm text-muted-foreground">AI Processing Status</p>
        </div>

        {/* Chart */}
        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={queueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3240" />
              <XAxis dataKey="name" stroke="#a0a8b3" />
              <YAxis stroke="#a0a8b3" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #d4af37',
                  borderRadius: '8px',
                }}
                cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {queueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          {queueData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
