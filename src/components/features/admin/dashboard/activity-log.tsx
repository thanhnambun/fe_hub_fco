'use client'

import { Upload, CheckCircle, Clock, User, Archive, Image } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'upload',
    user: 'Sarah Mitchell',
    action: 'Uploaded archival collection',
    timestamp: '2 minutes ago',
    icon: Upload,
  },
  {
    id: 2,
    type: 'complete',
    user: 'AI Restoration Engine',
    action: 'Completed restoration of 12 portraits',
    timestamp: '15 minutes ago',
    icon: CheckCircle,
  },
  {
    id: 3,
    type: 'upload',
    user: 'James Rodriguez',
    action: 'Archived 340 historical documents',
    timestamp: '1 hour ago',
    icon: Archive,
  },
  {
    id: 4,
    type: 'process',
    user: 'System',
    action: 'Processing image batch #4521',
    timestamp: '28 minutes ago',
    icon: Image,
  },
  {
    id: 5,
    type: 'upload',
    user: 'Emma Thompson',
    action: 'Queued 56 photos for restoration',
    timestamp: '2 hours ago',
    icon: Upload,
  },
]

export function ActivityLog() {
  return (
    <div className="glass-effect p-8 rounded-xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-serif font-bold text-foreground mb-2">
            Activity Log
          </h2>
          <p className="text-sm text-muted-foreground">Recent archive uploads & restorations</p>
        </div>

        {/* Activities */}
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon

            return (
              <div
                key={activity.id}
                className={`flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-secondary/30 transition-all ${
                  index === 0 ? 'bg-primary/5 border-primary/20' : ''
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                {activity.type === 'complete' && (
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-accent mt-2" />
                )}
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        <button className="w-full py-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border text-foreground font-medium transition-all duration-200">
          View Complete Activity
        </button>
      </div>
    </div>
  )
}
