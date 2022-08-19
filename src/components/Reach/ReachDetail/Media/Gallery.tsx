import { Media, RequestStatus } from '../../../../types'
import { Carousel, Row, Col, Button } from 'antd'
import React, { useState } from 'react'
import './gallery.scss'
import { useUserContext } from '../../../User/UserContext'
import { useTranslation } from 'react-i18next'
import { deleteMedia } from '../../../../controllers'
import { notify } from '../../../../lib'

export type GalleryProps = {
  media: Media[]
  onSuccess: () => Promise<void>
}

export const Gallery = ({ media, onSuccess }: GalleryProps) => {
  const { user } = useUserContext()
  const { t } = useTranslation()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()

  const onChange = (currentSlide: number) => {
    console.log(currentSlide)
  }

  const handleDelete = async (mediaId: string) => {
    try {
      setRequestStatus('loading')
      await deleteMedia(mediaId)
      setRequestStatus('success')
      notify.success('Media deleted')
      await onSuccess()
    } catch (e) {
      setRequestStatus('failure')
      notify.error('Failed to delete media')
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <Carousel
        afterChange={onChange}
        dots={{ className: 'gallery-carousel-controls' }}
      >
        {media.map((m, idx) => (
          <div key={idx + '-' + m.id}>
            <Row className={'gallery-slide'} justify={'center'} gutter={24}>
              <Col sm={24} md={20}>
                <div className="img-wrapper">
                  <img src={m.url} alt={m.title} />
                </div>
              </Col>
              <Col sm={24} md={4}>
                <div className="info-panel">
                  <h3>{m.title}</h3>
                  <h5>{m.subTitle}</h5>
                  {user && user.id === m.userId && (
                    <Button
                      danger
                      loading={requestStatus === 'loading'}
                      onClick={() => handleDelete(m.id)}
                    >
                      {t('delete')}
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
