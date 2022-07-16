import { Typography } from 'antd'
import { useReachDetailContext } from '../ReachDetailContext'
import { FeatureCard } from './FeatureCard'

export const Features = () => {
  const { reach } = useReachDetailContext()

  const features = reach?.features || []

  if (features.length === 0) {
    return <Typography.Text>Feature data unavailable</Typography.Text>
  }

  return (
    <>
      {features.map((feat, idx) => (
        <FeatureCard feature={feat} key={idx} />
      ))}
    </>
  )
}
