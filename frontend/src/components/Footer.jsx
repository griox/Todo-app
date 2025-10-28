import React, { useEffect } from 'react'

const Footer = ({ completedCount = 0, pendingCount = 0 }) => {
  useEffect(() => {
    console.log('Footer props updated:', { completedCount, pendingCount });
  }, [completedCount, pendingCount]);

  const total = Number(completedCount ?? 0) + Number(pendingCount ?? 0);
  return (
    <>
      {total > 0 && (
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            {
              completedCount > 0 && (
                <>
                  Congratulations! You have completed {completedCount} task{completedCount > 1 ? 's' : ''}
                  { pendingCount > 0 && ` and have ${pendingCount} remaining active task${pendingCount > 1 ? 's' : ''}.` }
                </>
              )
            }
          </p>
        </div>
      )}
    </>
  )
}

export default Footer
