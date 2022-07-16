import { Media } from '../../../../types'
import { Carousel } from 'antd'
import React from 'react'
import './gallery.scss'

export type GalleryProps = {
  media: Media[]
}

export const Gallery = ({ media }: GalleryProps) => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide)
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <Carousel afterChange={onChange}>
        {media.map((m, idx) => (
          <div key={idx + '-' + m.id}>
            <div className={'gallery-slide'}>
              <div className="img-wrapper">
                <img src={m.url} />
              </div>
              <div className="info-panel">
                <h3>{m.title}</h3>
                <h5>{m.subTitle}</h5>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
