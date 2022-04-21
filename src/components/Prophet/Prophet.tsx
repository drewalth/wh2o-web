import { GageMap } from './GageMap'
import { useState } from 'react'
import { RiverForm } from './RiverForm'
import { Col, Row } from 'antd'

export const Prophet = () => {
  const [siteId, setSiteId] = useState('06719505')
  const [siteDescription, setSiteDescription] = useState(
    'CLEAR CREEK AT GOLDEN, CO',
  )

  const handleSelectGage = (siteId: string, siteDescription: string) => {
    setSiteDescription(siteDescription)
    setSiteId(siteId)
  }

  return (
    <div>
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <GageMap onSelectGauge={handleSelectGage} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <RiverForm siteDescription={siteDescription} siteId={siteId} />
        </Col>
      </Row>
    </div>
  )
}
