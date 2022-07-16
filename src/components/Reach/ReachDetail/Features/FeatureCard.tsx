import { Feature } from '../../../../types'

export type FeatureCardProps = {
  feature: Feature
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  return <div>{JSON.stringify(feature)}</div>
}
