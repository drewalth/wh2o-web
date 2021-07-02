import { Result } from 'antd'

interface NotificationsProps {
  userId: number
}

export const Notifications = (props: NotificationsProps) => {
  return (
    <Result status="500" title="500" subTitle="Sorry, something went wrong." />
  )
}
