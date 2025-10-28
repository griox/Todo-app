import { Filtertype } from '@/lib/data'
import {  Filter } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const StatsandFilter = ({pendingCount=0, completedCount=0, filter = "all",  setFilter}) => {
  return (
    <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      <div className='flex gap-3'>
        <Badge variant ="secondary"
        className='bg-white/50 text-accent-foreground border-info/20'>{pendingCount} {Filtertype.pending} tasks</Badge>
        <Badge variant ="secondary"
        className='bg-white/50 text-success border-success/20'>{completedCount} {Filtertype.completed} tasks</Badge>
      </div>

      <div className='flex flex-col gap-2 sm:flex-row'>
        {
          Object.keys(Filtertype).map((type) => (
            <Button
            key={type}
            variant={filter === type ? "gradient" : "ghost"}
            size='sm'
            className='capitalize'
            onClick={() => setFilter(type)}
            >
              <Filter className='size-4'/>
              {Filtertype[type]}
            </Button>
      ))}
      <Button variant="ghost"></Button>
      </div>
    </div>
  )
}

export default StatsandFilter
