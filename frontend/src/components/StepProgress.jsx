import React from 'react'
import { shimmerStyle } from '../assets/dummystyle'
import { Check } from 'lucide-react'

const StepProgress = ({ progress }) => {
  return (
   <>
   <style>{shimmerStyle}</style>
   <div className="flex items-center">
     <div className="relative w-full h-4 bg-white/5 backdrop-blur-2xl overflow-hidden rounded-full border border-white/10">
     <div className=' absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20' />
         <div className='relative h-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500 ease-in-out' style={{ width: `${progress}%` }}>
            <div className='absolute inset-0 bg-gradient-to-r from-transparent to-white/10' />
             <div className='absolute inset-0 bg-gradient-to-r from-transparent to-white/10' />
                <div className='absolute inset-0 opacity-80'>
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className=' absolute top-1/2 w-2 h-2 rounded-full bg-white/10 animate-bubble shadow-lg' style={{ 
                            left: `${index * 12}%`,
                            animationDelay: `${index * 0.3}s`,
                            transform: 'translateY(-50%)'
                        }} />
                    ))}
                </div>
                <div className='absolute inset-0 ' />
                 {[...Array(12)].map((_, index) => (
                    <div key={index} className=' absolute  w-1 h-1 rounded-full bg-white/10 animate-shimmer'
                     style={{
                         left: `${Math.random() * 100}%`,
                         top: `${Math.random() * 100}%`,
                         animationDelay: `${Math.random() * 2}s`
                     }} />
                 ))}
               </div>
               </div>
               {progress > 0 && (
                 <div className='absolute top-0 w-8 h-full rounded-full bg-gradient-to-r from-transparent via-white/50 to-white/30 blur-sm' style={{ left: `${Math.max(0, progress - 4)}%` }}>
                  
                 </div>
               )}
               </div>
                <div className='flex justify-between items-center mt-3'>
                    <div className='text-sm text-white/60'>
                    {progress < 25 ? "Getting Started" : progress < 50 ? "Making Progress" : progress < 75 ? "Almost There"  : "Nearly Completed"}
                    </div>
                <div className='flex items-center gap-2'>
                    {progress === 100 && (
                        <div className='w-6 h-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse'>
                            <Check size={12} color="text-white" />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default StepProgress
