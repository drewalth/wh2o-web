import { Typography } from 'antd'
import { useReachDetailContext } from './ReachDetailContext'

export const Hero = () => {
  const { reach } = useReachDetailContext()

  return (
    <>
      <Typography.Title
        style={{ lineHeight: 1, marginBottom: 0, paddingBottom: 0 }}
      >
        {reach?.name}
      </Typography.Title>
      <Typography.Title style={{ marginTop: 0, marginBottom: 24 }} level={4}>
        {reach?.section}
      </Typography.Title>
    </>
  )
}
