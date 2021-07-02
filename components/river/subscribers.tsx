import { IUser } from '../../interfaces'
import { Result } from 'antd'

interface SubscribersProps {
  subscribers: IUser[]
}

export const Subscribers = (props: SubscribersProps) => {
  return (
    <>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
      />
    </>
  )
}
