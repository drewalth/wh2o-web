import { Typography } from 'antd'
import { AccessMap } from './AccessMap'
import { useReachDetailContext } from '../ReachDetailContext'

export const Access = () => {
  const { reach } = useReachDetailContext()

  return (
    <>
      <AccessMap latitude={reach?.latitude} longitude={reach?.longitude} />
      <Typography.Paragraph>
        {reach?.access || 'Access info unavailable'}
      </Typography.Paragraph>
    </>
  )
}
