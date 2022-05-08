import { GageMap } from './GageMap'
import { useState } from 'react'
import { RiverForm } from './RiverForm'
import { Alert, Col, PageHeader, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const Prophet = () => {
  const { t } = useTranslation()
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
        title={t('prophet')}
        onBack={() => navigate('/')}
        extra={
          <Alert
            message={t('currentlyAvailableForUSGSOnly')}
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
