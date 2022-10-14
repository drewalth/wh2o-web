import React, { CSSProperties, useEffect, useState } from 'react'
import {
  Card,
  Col,
  Divider,
  notification,
  PageHeader,
  Result,
  Row,
  Spin,
  Statistic,
} from 'antd'
import { GageReadingsChart } from './GageReadingsChart'
import moment from 'moment'
import { GageMap } from './GageMap'
import { Gage, GageSource, RequestStatus } from '../../types'
import { getGage } from '../../controllers'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorBoundary } from '../Common/ErrorBoundary'
import { GageBookmarkToggle } from '../Common/GageBookmarkToggle'
import { RiverForm } from '../Prophet/RiverForm'

import { useTranslation } from 'react-i18next'
import { SEO } from '../Common'

const whiteBg: CSSProperties = {
  backgroundColor: '#fff',
}

export const GageDetail = () => {
  const [gage, setGage] = useState<Gage>()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')
  const navigate = useNavigate()
  const { id: gageId } = useParams()
  const { t } = useTranslation()

  const getSEOTitle = () => {
    if (gage) {
      return `wh2o - ${gage.name} - ${gage.state}, ${gage.country}`
    }
    return 'wh2o'
  }

  const getSEOLink = () => {
    if (gage) {
      return `https://wh2o.io/gage/${gage.id}`
    }
    return `https://wh2o.io/gage`
  }

  const getSEODescription = () => {
    if (gage) {
      if (gage.source === GageSource.USGS) {
        return `Historical flow data, forecasting, and custom reporting for the ${gage.name} river gage in ${gage.state}, ${gage.country}`
      }
      return `Historical flow data and custom reporting for the ${gage.name} river gage in ${gage.country}`
    }

    return ''
  }

  useEffect(() => {
    ;(async () => {
      try {
        setRequestStatus('loading')
        if (!gageId) return
        const result = await getGage(gageId)
        setGage(result)
        setRequestStatus('success')
      } catch (e) {
        console.error(e)
        setRequestStatus('failure')
        notification.error({
          message: t('failedToLoadEntity', { entity: t('gage') }),
          placement: 'bottomRight',
        })
      }
    })()
  }, [])

  if (!gage && requestStatus === 'loading') {
    return <Spin />
  }

  if (!gage && requestStatus === 'failure') {
    return <Result status={500} />
  }

  if (!gage) {
    return null
  }

  return (
    <>
      <Row style={{ ...whiteBg }}>
        <Col span={24}>
          <ErrorBoundary>
            <PageHeader
              title={gage?.name || ''}
              subTitle={`${gage?.state}, ${gage?.country}`}
              onBack={() => navigate('/gage')}
              extra={<GageBookmarkToggle gageId={gage.id} />}
            />
          </ErrorBoundary>
          <Divider style={{ margin: 0 }} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ErrorBoundary>
            <GageMap latitude={gage.latitude} longitude={gage.longitude} />
          </ErrorBoundary>
        </Col>
      </Row>
      <Row style={{ ...whiteBg }}>
        <Col span={24} md={24} lg={24}>
          {gage && gage?.readings && gage?.readings?.length > 0 && (
            <GageReadingsChart
              readings={gage.readings}
              metric={gage.metric}
              gage={gage}
            />
          )}
        </Col>
        <Col span={24} md={24} lg={12} style={{ height: '100%' }}>
          <Card style={{ border: 0 }}>
            <Row style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Statistic
                  title={t('latestReading')}
                  loading={requestStatus === 'loading'}
                  value={gage?.reading + ' ' + gage?.metric || '-'}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={t('updated')}
                  loading={requestStatus === 'loading'}
                  value={
                    gage.updatedAt
                      ? moment(gage?.updatedAt).local().format('ll hh:mm a')
                      : '-'
                  }
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          {gage.source === GageSource.USGS && (
            <RiverForm
              siteId={gage.siteId}
              siteDescription={t('forecast')}
              historicalAverageChartVisible={false}
              dividerVisible={false}
            />
          )}
        </Col>
      </Row>
      <Row>
        {gage.source === GageSource.USGS && (
          <Col
            span={12}
            style={{
              padding: '24px 0',
            }}
          >
            <Statistic
              title={'source'}
              formatter={() => (
                <>
                  <a
                    href={`https://waterdata.usgs.gov/nwis/uv?site_no=${
                      gage?.siteId || 0
                    }`}
                    target={'_blank'}
                    rel="noreferrer"
                  >
                    {gage.source}
                  </a>
                </>
              )}
            />
          </Col>
        )}
      </Row>
      <SEO
        title={getSEOTitle()}
        link={getSEOLink()}
        description={getSEODescription()}
      />
    </>
  )
}
