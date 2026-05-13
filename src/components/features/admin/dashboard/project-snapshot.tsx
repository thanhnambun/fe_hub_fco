'use client'

import Image from 'next/image'

const projects = [
  {
    id: 1,
    title: 'Portrait Collection 1920s',
    before: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80&blur=20',
    after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Family Photos 1950s',
    before: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80&blur=20',
    after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Historical Documents',
    before: 'https://images.unsplash.com/photo-1500634148414-437df07f56e3?w=200&h=200&fit=crop&q=80&blur=20',
    after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Landscape Archive',
    before: 'https://images.unsplash.com/photo-1495604653989-0e612f1e1475?w=200&h=200&fit=crop&q=80&blur=20',
    after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
  },
]

export function ProjectSnapshot() {
  return (
    <div className="glass-effect p-8 rounded-xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-serif font-bold text-foreground mb-2">
            Project Snapshot
          </h3>
          <p className="text-sm text-muted-foreground">Recently restored images - Before/After</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative cursor-pointer"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-primary/40 hover:border-primary/80 transition-all duration-300">
                {/* Before Image */}
                <div className="absolute inset-0 w-1/2 h-full overflow-hidden">
                  <img
                    src={project.before}
                    alt={`${project.title} - Before`}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="absolute bottom-2 left-2 text-xs font-semibold bg-black/50 px-2 py-1 rounded text-primary">
                    BEFORE
                  </span>
                </div>

                {/* After Image */}
                <div className="absolute inset-0 w-1/2 h-full overflow-hidden right-0">
                  <img
                    src={project.after}
                    alt={`${project.title} - After`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 text-xs font-semibold bg-black/50 px-2 py-1 rounded text-primary">
                    AFTER
                  </span>
                </div>

                {/* Divider Line */}
                <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
              </div>

              {/* Hover Title */}
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm font-medium text-foreground">{project.title}</p>
                <p className="text-xs text-muted-foreground">Split view comparison</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button className="w-full py-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border text-foreground font-medium transition-all duration-200">
          View All Restorations
        </button>
      </div>
    </div>
  )
}
