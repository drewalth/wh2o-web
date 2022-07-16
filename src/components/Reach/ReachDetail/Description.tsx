import { Typography } from 'antd'
import { useReachDetailContext } from './ReachDetailContext'

export const Description = () => {
  const { reach } = useReachDetailContext()

  const description = reach?.description

  return (
    <Typography.Paragraph>
      {description || 'Description unavailable'}
    </Typography.Paragraph>
  )
}
