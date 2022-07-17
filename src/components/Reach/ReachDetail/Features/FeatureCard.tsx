import { Feature, Media } from '../../../../types'
import './feature-card.scss'
import { Typography, Row, Col, Button, Divider } from 'antd'
import { useBreakpoint } from '../../../../hooks'
import { FeatureMedia } from './FeatureMedia'
import { FeatureIcons } from './FeatureIcons'
import { useUserContext } from '../../../User/UserContext'

export type FeatureCardProps = {
  feature: Feature
  media: Media[]
  onEdit: (feature: Feature) => void
}

export const FeatureCard = ({ feature, onEdit, media }: FeatureCardProps) => {
  const { isMobile } = useBreakpoint()
  const { canContribute } = useUserContext()

  const descriptionCol = {
    span: isMobile ? 24 : 18,
  }

  const mediaCol = {
    span: isMobile ? 24 : 8,
  }

  return (
    <section className={'feature-card'}>
      <Row justify={'space-between'} align={'middle'}>
        <Col>
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            {feature.name}
          </Typography.Title>
        </Col>
        <Col>
          {canContribute && (
            <Button onClick={() => onEdit(feature)}>edit</Button>
          )}
        </Col>
        <Col span={24}>
          <Divider />
        </Col>
      </Row>
      <Row>
        <Col>
          <FeatureIcons feature={feature} />
        </Col>
        <Col span={24}>
          <Divider />
        </Col>
      </Row>
      <Row>
        <Col {...descriptionCol}>
          <Typography.Paragraph>{feature.description}</Typography.Paragraph>
        </Col>
        <Col {...mediaCol}>
          <FeatureMedia media={media} />
        </Col>
      </Row>
    </section>
  )
}
