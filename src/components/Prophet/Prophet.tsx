import { GageMap } from './GageMap'
import React, { useState } from 'react'
import { RiverForm } from './RiverForm'
import { Alert, Col, PageHeader, Row } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEO } from '../Common'

export const Prophet = () => {
  const { t } = useTranslation()
  const [params] = useSearchParams()

  const paramSiteId = params.get('siteId')

  const [siteId, setSiteId] = useState(paramSiteId || '06719505')
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
      <SEO
        title={'wh2o - Prophet'}
        link={'https://wh2o.io/prophet'}
        description={'River flow predictions for USGS river gages'}
      />
    </>
  )
}
