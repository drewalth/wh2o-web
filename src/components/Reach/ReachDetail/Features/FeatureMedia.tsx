import { Media, MediaType } from '../../../../types'
import { Carousel } from 'antd'
import './feature-media.scss'

export type FeatureMediaProps = {
  media: Media[]
}

export const FeatureMedia = ({ media }: FeatureMediaProps) => {
  const empty = media.length === 0

  const onChange = (currentSlide: number) => {
    console.log(currentSlide)
  }

  const getThumbnail = (med: Media) => {
    switch (med.type) {
      case MediaType.IMAGE:
        return <img src={med.url} alt={med.title} />
    }
  }

  if (empty) {
    return null
  }

  return (
    <div className={'feature-media'}>
      <Carousel afterChange={onChange}>
        {media.map((m) => (
          <div key={m.id}>
            <div className={'image-thumb'}>{getThumbnail(m)}</div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
