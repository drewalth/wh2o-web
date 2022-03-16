import React, { useEffect } from 'react'
import { Button, Card, Col, Divider, PageHeader, Row, Statistic } from 'antd'
import { useGageContext } from './gageContext'
import { GageReadingsChart } from './GageReadingsChart'
import moment from 'moment'
import { useUserContext } from '../user/userContext'
import { GagePageData } from '../../../gatsby-node'
import { navigate } from 'gatsby'
import { GageMap } from './GageMap'

type PageContext = {
  pageContext: {
    gage: GagePageData
  }
}

const GageDetail = ({ pageContext: { gage: preloadedData } }: PageContext) => {
  const { loading, gage, loadGageDetail } = useGageContext()
  const { addUserGage, data: userData } = useUserContext()

  useEffect(() => {
    ;(async () => {
      await loadGageDetail(preloadedData.id)
    })()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'space-between',
        height: 'calc(100vh - 72px)',
        position: 'relative'
      }}
    >
      <div>
        {preloadedData.latitude && preloadedData.longitude && (
          <GageMap latitude={preloadedData.latitude} longitude={preloadedData.longitude} />
        )}
      </div>
      <Row
        align={'top'}
        style={{
          backgroundColor: '#fff',
          zIndex: 2,
          position: 'absolute',
          bottom: 0,
          width: '100%'
        }}
      >
        <Col span={24}>
          <PageHeader
            title={preloadedData.name}
            subTitle={`${preloadedData.state}, ${preloadedData.country}`}
            onBack={() => navigate('/gages')}
            extra={
              <>
                {userData && (
                  <Button
                    onClick={async () => {
                      await addUserGage(gage.id)
                    }}
                  >
                    Bookmark
                  </Button>
                )}
              </>
            }
          />
          <Divider style={{ margin: 0 }} />
        </Col>
        <Col span={24} md={24} lg={12} style={{ height: '100%' }}>
          <Card style={{ border: 0, paddingTop: 16 }}>
            <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Statistic
                  title={'latest reading'}
                  loading={loading}
                  value={gage?.latestReading + ' ' + gage?.metric || '-'}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={'delta'}
                  value={'-'}
                  // prefix={<ArrowUpOutlined/>}
                  // valueStyle={{color: '#3f8600'}}
                  loading={loading}
                  // suffix={gage?.metric || 'cfs'}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Statistic
                  title={'last fetched'}
                  loading={loading}
                  value={moment(gage?.updatedAt).format('l hh:mm a') || '-'}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={'source'}
                  formatter={() => (
                    <>
                      <a
                        href={`https://waterdata.usgs.gov/nwis/uv?site_no=${gage?.siteId || 0}`}
                        target={'_blank'}
                        rel="noreferrer"
                      >
                        {preloadedData.source}
                      </a>
                    </>
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col></Col>
            </Row>
          </Card>
        </Col>
        <Col span={24} md={24} lg={12}>
          {gage && gage.readings.length > 0 && <GageReadingsChart readings={gage.readings} metric={gage.metric} />}
        </Col>
      </Row>
    </div>
  )
}

export default GageDetail
