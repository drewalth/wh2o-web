import { GageMap } from './GageMap'
import { useState } from 'react'
import { RiverForm } from './RiverForm'
import { Alert, Col, PageHeader, Row } from 'antd'
import { useNavigate } from 'react-router-dom'

export const Prophet = () => {
  const [siteId, setSiteId] = useState('06719505')
  const [siteDescription, setSiteDescription] = useState(
    'CLEAR CREEK AT GOLDEN, CO',
  )
  const navigate = useNavigate()

  const handleSelectGage = (siteId: string, siteDescription: string) => {
    setSiteDescription(siteDescription)
    setSiteId(siteId)
  }

  return (
    <>
      <PageHeader
        title={'Prophet'}
        onBack={() => navigate('/')}
        extra={
          <Alert
            message="Currently available for USGS gages only"
            type="info"
            showIcon
          />
        }
      />
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
    </>
  )
}
