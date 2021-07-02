import { IMedia } from 'interfaces'
import { Card, Empty } from 'antd'

interface MediaProps {
  userId: number
  media: IMedia[]
}

export const Media = (props: MediaProps) => {
  const { media } = props
  return (
    <Card>
      <Empty description="No media" />
    </Card>
  )
}
