import React, { CSSProperties, useEffect, useState } from 'react'
import {
  Card,
  Col,
  Divider,
  PageHeader,
  Row,
  Statistic,
  Button,
  notification,
  Typography,
  Tooltip,
} from 'antd'
import { GageReadingsChart } from './GageReadingsChart'
import moment from 'moment'
import { GageMap } from './GageMap'
import { Gage, GageMetric, GageReading, RequestStatus } from '../../types'
import { addUserGage, getGage, removeUserGage } from '../../controllers'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserContext } from '../User/UserContext'
import { FlowRangeTable } from './FlowRangeTable'

type BookmarkButtonProps = {
  text: string
  onClick: () => void
}

const whiteBg: CSSProperties = {
  backgroundColor: '#fff',
}

export const GageDetail = () => {
  const { user, reload } = useUserContext()
  const [gage, setGage] = useState<Gage>()
  const [delta, setDelta] = useState('')
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('loading')
  const navigate = useNavigate()
  const { id: gageId, state: gageState } = useParams()

  const getDelta = (
    readings: GageReading[] | undefined,
    metric: GageMetric,
  ) => {
    function getPercentageChange(oldNumber, newNumber) {
      var decreaseValue = oldNumber - newNumber

      if (oldNumber === 0) return

      return ((decreaseValue / oldNumber) * 100).toFixed(2)
    }

    const filteredReadings = readings?.filter((r) => r.metric === metric)

    if (
      filteredReadings &&
      Array.isArray(filteredReadings) &&
      filteredReadings.length >= 2
    ) {
      // return relDiff(
      //   readings[readings.length - 1].value,
      //   readings[readings.length - 2].value,
      // )

      // const diff = getPercentageChange(
      //   readings[readings.length - 2].value,
      //   readings[readings.length - 1].value,
      // )

      const diff = getPercentageChange(
        Math.floor(filteredReadings[filteredReadings.length - 2].value),
        Math.floor(filteredReadings[filteredReadings.length - 1].value),
      )

      if (diff === undefined) {
        return '-'
      }

      if (String(diff).charAt(0) === '-') {
        return `+${diff.substring(1, diff.length - 1)}%`
      }

      return `-${diff}%`
    } else {
      debugger
    }

    return '-'
  }

  const bookMarkButtonProps: BookmarkButtonProps = (() => {
    if (!user || !gage)
      return {
        text: '',
        onClick: () => {},
      }
    const exists = user?.gages.find((g) => g.id === gage.id)

    return {
      text: !!exists ? 'Remove Bookmark' : 'Add Bookmark',
      onClick: async () => {
        try {
          const fn = !!exists ? removeUserGage : addUserGage
          await fn(gage.id, user.id)

          notification.success({
            message: !!exists ? 'Bookmark removed' : 'Bookmark added',
            placement: 'bottomRight',
          })
          await reload()
        } catch (e) {
          notification.error({
            message: 'Something went wrong',
            placement: 'bottomRight',
          })
        }
      },
    }
  })()

  useEffect(() => {
    if (gage && gage.readings && gage.readings.length >= 2) {
      const val = getDelta(gage.readings, gage.metric)
      setDelta(val)
    }
  }, [gage])

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
    <>
      <Row>
        <Col span={24}>
          <GageMap latitude={gage.latitude} longitude={gage.longitude} />
        </Col>
      </Row>
      <Row style={{ ...whiteBg }}>
        <Col span={24}>
          <PageHeader
            title={gage?.name || ''}
            subTitle={`${gage?.state}, ${gage?.country}`}
            onBack={() => navigate('/gage')}
            extra={
              <>
                {!!user ? (
                  <Button
                    type={'primary'}
                    onClick={bookMarkButtonProps.onClick}
                  >
                    {bookMarkButtonProps.text}
                  </Button>
                ) : (
                  <Tooltip title={'Log in to bookmark'}>
                    <Button type={'primary'} disabled>
                      Add Bookmark
                    </Button>
                  </Tooltip>
                )}
              </>
            }
          />
          <Divider style={{ margin: 0 }} />
        </Col>
      </Row>
      <Row style={{ ...whiteBg }}>
        <Col span={24} md={24} lg={24}>
          {gage && !!gage.readings && gage?.readings?.length > 0 && (
            <GageReadingsChart readings={gage.readings} metric={gage.metric} />
          )}
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
                  value={delta}
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
                  value={
                    gage.updatedAt
                      ? moment(gage?.updatedAt).format('l hh:mm a')
                      : '-'
                  }
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
      </Row>
      <Row style={{ ...whiteBg }}>
        <Col span={24} md={24} lg={12}>
          <Card style={{ border: 0 }} title={'Description'}>
            <Typography.Text>
              {gage.description || 'No description available.'}
            </Typography.Text>
          </Card>
        </Col>
      </Row>
      <Row style={{ ...whiteBg }}>
        <Col span={24} md={24}>
          <FlowRangeTable flowRanges={gage.flowRanges || []} />
        </Col>
      </Row>
    </>
  )
}
