import { GageMap } from './GageMap'
import { useState } from 'react'
import { RiverForm } from './RiverForm'

export const Prophet = () => {
  const [siteId, setSiteId] = useState('06719505')
  const [siteDescription, setSiteDescription] = useState(
    'CLEAR CREEK AT GOLDEN, CO',
  )

  const handleSelectGage = (siteId: string, siteDescription: string) => {
    setSiteDescription(siteDescription)
    setSiteId(siteId)
  }

  return (
    <>
      <GageMap onSelectGauge={handleSelectGage} />
      <RiverForm siteDescription={siteDescription} siteId={siteId} />
    </>
  )
}
