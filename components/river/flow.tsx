import { IGage } from '../../interfaces'

interface FlowProps {
  gages: IGage[]
}

export const Flow = (props: FlowProps) => {
  return (
    <>
      <h1>Flow</h1>
      <div>{JSON.stringify(props.gages)}</div>
    </>
  )
}
