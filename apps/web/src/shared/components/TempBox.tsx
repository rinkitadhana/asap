import LayoutWrapper from '@/shared/layout/LayoutWrapper'
import React from 'react'

const TempBox = () => {
    return (
        <LayoutWrapper>
            <div className='border-x-2 border-primary-border border-dashed p-4'>
                <div className='flex  flex-col min-h-[200px]  shadow-md shadow-primary-shadow justify-between w-full border border-primary-border rounded-xl p-8 bg-secondary'>
                </div>
            </div>
        </LayoutWrapper>
    )
}

export default TempBox
