import { IUser } from '../../interfaces'

interface SubscribersProps {
  subscribers: IUser[]
}

export const Subscribers = (props: SubscribersProps) => {
  return (
    <>
      <h1>Subscribers</h1>
      <div>{JSON.stringify(props.subscribers)}</div>
    </>
  )
}
