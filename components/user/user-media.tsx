import { Media } from 'types'
import { Card, Empty } from 'antd'

interface UserMediaProps {
  userId: number
  media: Media[]
}

export const UserMedia = (props: UserMediaProps) => {
  const { media } = props
  return (
    <Card>
      <Empty description="No media" />
    </Card>
  )
}
