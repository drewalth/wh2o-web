import { Feature, Media, RequestStatus } from '../../../../types'
import './feature-card.scss'
import { Typography, Row, Col, Button, Divider, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useBreakpoint } from '../../../../hooks'
import { FeatureMedia } from './FeatureMedia'
import { FeatureIcons } from './FeatureIcons'
import { useUserContext } from '../../../User/UserContext'
import { useState } from 'react'
import { notify } from '../../../../lib'
import { deleteFeature } from '../../../../controllers'

export type FeatureCardProps = {
  feature: Feature
  media: Media[]
  onEdit: (feature: Feature) => void
  onDelete: () => Promise<void>
}

export const FeatureCard = ({
  feature,
  onEdit,
  media,
  onDelete,
}: FeatureCardProps) => {
  const { isMobile } = useBreakpoint()
  const { canContribute, user } = useUserContext()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()

  const descriptionCol = {
    span: isMobile ? 24 : 18,
  }

  const mediaCol = {
    span: isMobile ? 24 : 4,
  }

  const handleDelete = async () => {
    try {
      setRequestStatus('loading')

      await deleteFeature(feature.id)

      setRequestStatus('success')
      notify.success('feature deleted')

      await onDelete()
    } catch (e) {
      setRequestStatus('failure')
      notify.error('failed to delete feature')
    }
  }

  const getEmptyMessage = () => {
    if (user && !canContribute) {
      return 'Apply to become an editor!'
    }

    if (!user) {
      return 'No description available. Log in to add one!'
    }

    return 'Description unavailable'
  }

  const getDescription = () => {
    if (feature.description.length > 0) return feature.description

    return getEmptyMessage()
  }

  return (
    <section className={'feature-card'}>
      <Row justify={'space-between'} align={'middle'}>
        <Col style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Title
            level={4}
            style={{ marginBottom: 0, marginRight: 16 }}
          >
            {feature.name}
          </Typography.Title>
          <FeatureIcons feature={feature} />
        </Col>
        <Col>
          {canContribute && (
            <>
              <Button
                onClick={() => onEdit(feature)}
                style={{ marginRight: 8 }}
                disabled={requestStatus === 'loading'}
              >
                <EditOutlined />
              </Button>
              <Popconfirm
                title={'Are you sure you want to delete this feature?'}
                placement={'left'}
                onConfirm={handleDelete}
              >
                <Button danger loading={requestStatus === 'loading'}>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </>
          )}
        </Col>
        <Col span={24}>
          <Divider style={{ marginTop: 8 }} />
        </Col>
      </Row>
      <Row justify={'space-between'}>
        <Col {...descriptionCol}>
          <Typography.Paragraph>{getDescription()}</Typography.Paragraph>
        </Col>
        <Col {...mediaCol}>
          <FeatureMedia media={media} />
        </Col>
      </Row>
    </section>
  )
}
