import React, { useEffect, useState } from 'react'
import { Card, Col, Divider, PageHeader, Row, Statistic } from 'antd'
import { GageReadingsChart } from './GageReadingsChart'
import moment from 'moment'
import { GageMap } from './GageMap'
import { Gage, RequestStatus } from '../../types'
import { getGage } from '../../controllers'
import { useNavigate, useParams } from 'react-router-dom'

export const GageDetail = () => {
  // const { user } = useUserContext()
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

  if (!gage) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'space-between',
        height: 'calc(100vh - 72px)',
        position: 'relative',
      }}
    >
      <div>
        {gage.latitude && gage.longitude && (
          <GageMap latitude={gage.latitude} longitude={gage.longitude} />
        )}
      </div>
      <Row
        align={'top'}
        style={{
          backgroundColor: '#fff',
          zIndex: 2,
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
      >
        <Col span={24}>
          <PageHeader
            title={gage?.name || ''}
            subTitle={`${gage?.state}, ${gage?.country}`}
            onBack={() => navigate('/gage')}
            extra={
              <>
                {/*{userData && (*/}
                {/*  <Button*/}
                {/*    onClick={async () => {*/}
                {/*      await addUserGage(gage.id)*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    Bookmark*/}
                {/*  </Button>*/}
                {/*)}*/}
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
                  loading={requestStatus === 'loading'}
                  value={gage?.reading + ' ' + gage?.metric || '-'}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={'delta'}
                  value={'-'}
                  // prefix={<ArrowUpOutlined/>}
                  // valueStyle={{color: '#3f8600'}}
                  loading={requestStatus === 'loading'}
                  // suffix={gage?.metric || 'cfs'}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Statistic
                  title={'last fetched'}
                  loading={requestStatus === 'loading'}
                  value={moment(gage?.updatedAt).format('l hh:mm a') || '-'}
                />
              </Col>
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
            <Row>
              <Col></Col>
            </Row>
          </Card>
        </Col>
        <Col span={24} md={24} lg={12}>
          {gage && !!gage.readings && gage?.readings?.length > 0 && (
            <GageReadingsChart readings={gage.readings} metric={gage.metric} />
          )}
        </Col>
      </Row>
    </div>
  )
}
