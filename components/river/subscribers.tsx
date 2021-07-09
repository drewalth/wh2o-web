import { User } from '../../interfaces'
import { Empty, Tag } from 'antd'

interface SubscribersProps {
  subscribers: User[]
}

export const Subscribers = (props: SubscribersProps) => {
  const { subscribers } = props
  return (
    <>
      {subscribers.length ? (
        subscribers.map((sub) => (
          <Tag color="magenta">{`${sub.firstName} ${sub.lastName}`}</Tag>
        ))
      ) : (
        <Empty description="No subscribers" />
      )}
    </>
  )
}
