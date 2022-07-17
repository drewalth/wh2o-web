import { Media } from '../../../../types'
import classNames from 'classnames'

export type FeatureMediaProps = {
  media: Media[]
}

export const FeatureMedia = ({ media }: FeatureMediaProps) => {
  const empty = media.length === 0
  const classes = classNames('feature-media', empty ? 'empty' : '')

  if (empty) {
    return <div className={classes}>no media</div>
  }

  return <div className={classes}>{media[0].url}</div>
}
