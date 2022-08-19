import { Typography } from 'antd'
import { useReachDetailContext } from '../ReachDetailContext'

export const Description = () => {
  const { reach } = useReachDetailContext()

  const description = reach?.description

  return (
    <Typography.Paragraph id={'reach-description'}>
      {description && (
        <div
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      )}
    </Typography.Paragraph>
  )
}
