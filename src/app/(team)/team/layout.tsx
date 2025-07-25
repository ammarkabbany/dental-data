import MainFooter from '@/components/layout/Footer'
import React from 'react'

const TeamLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <MainFooter />
    </div>
  )
}

export default TeamLayout