import React, { CSSProperties, useEffect, useState } from 'react'
import {
  Card,
  Col,
  Divider,
  PageHeader,
  Result,
  Row,
  Spin,
  Statistic,
} from 'antd'
import { GageReadingsChart } from './GageReadingsChart'
import moment from 'moment'
import { GageMap } from './GageMap'
import { Gage, RequestStatus } from '../../types'
import { getGage } from '../../controllers'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorBoundary } from '../Common/ErrorBoundary'
import { GageBookmarkToggle } from '../Common/GageBookmarkToggle'
import { RiverForm } from '../Prophet/RiverForm'

const whiteBg: CSSProperties = {
  backgroundColor: '#fff',
}

export const GageDetail = () => {
  const [gage, setGage] = useState<Gage>()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')
  const navigate = useNavigate()
  const { id: gageId, state: gageState } = useParams()

  useEffect(() => {
    ;(async () => {
      try {
        setRequestStatus('loading')
        if (!gageId) return
        const result = await getGage(gageState || '', parseInt(gageId, 10))
        setGage(result)
        setRequestStatus('success')
      } catch (e) {
        console.error(e)
        setRequestStatus('failure')
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
          {gage && gage.readings && gage.readings.length > 0 && (
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
                  title={'latest reading'}
                  loading={requestStatus === 'loading'}
                  value={gage?.reading + ' ' + gage?.metric || '-'}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={'last fetched'}
                  loading={requestStatus === 'loading'}
                  value={
                    gage.updatedAt
                      ? moment(gage?.updatedAt).local().format('l hh:mm a')
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
          <RiverForm
            siteId={gage.siteId}
            siteDescription={'Flow Forecast'}
            historicalAverageChartVisible={false}
            dividerVisible={false}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
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
      </Row>
    </>
  )
}
