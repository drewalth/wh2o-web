import { useEffect, useState } from 'react'
import { getGage } from 'controllers'
import { GetServerSideProps } from 'next'
import {
  Card,
  Col,
  Descriptions,
  Layout,
  PageHeader,
  Row,
  Spin,
  Table,
} from 'antd'
import { Gage, GageReading, GageSource } from 'types'
import { useRouter } from 'next/router'
import moment from 'moment'
import { Bookmark, BookmarkEntity } from '../../components/river'
import { GageMap } from 'components/gage'

interface GageDetailProps {
  id: string
  mapboxToken: string
}

const GageDetail = (props: GageDetailProps) => {
  const router = useRouter()

  const { id, mapboxToken } = props

  const [loading, setLoading] = useState(false)
  const [gage, setGage] = useState<Gage>({
    description: '',
    flowRanges: [],
    id: 0,
    latestReading: '',
    latitude: 0,
    longitude: 0,
    metric: undefined,
    name: '',
    readings: [],
    riverId: 0,
    siteId: '',
    source: GageSource.USGS,
    state: '',
    updatedAt: undefined,
    users: [],
    createdAt: new Date(),
  })
  const [error, setError] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const result = await getGage(id)
      console.log(result)
      setGage(result)
    } catch (e) {
      console.log('e', e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const tableColumns = [
    {
      title: 'Reading',
      dataIndex: 'value',
      key: 'value',
      render: (value: string, reading: GageReading) =>
        `${value} ${reading.metric}`,
    },
    {
      title: 'Updated',
      dataIndex: 'createdAt',
      render: (val: Date) => moment(val).format('llll'),
    },
  ]

  useEffect(() => {
    load()
  }, [])

  if (loading && !gage) {
    return <Spin />
  }

  if (!loading && !gage) {
    return <div>something went wrong</div>
  }

  return (
    <>
      <PageHeader
        title={gage.name}
        onBack={() => router.push('/gages')}
        extra={[
          <Bookmark
            key={'bookmark'}
            entity={BookmarkEntity.GAGE}
            entityId={gage.id}
          />,
        ]}
      />
      <Layout.Content style={{ padding: '0 24px' }}>
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={24}>
            {gage.longitude && gage.latitude && (
              <GageMap
                latitude={gage.latitude}
                longitude={gage.longitude}
                mapboxToken={mapboxToken}
              />
            )}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24} sm={12}>
            <Card>
              <Descriptions>
                <Descriptions.Item label={'Latest Reading'}>
                  {gage.latestReading || 'n/a'}
                </Descriptions.Item>
                <Descriptions.Item label={'Primary Metric'}>
                  {gage.metric}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={24} sm={12}>
            <Card>
              <Table dataSource={gage.readings} columns={tableColumns} />
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      id: context.query.gid,
      mapboxToken: process.env.MAPBOX_ACCESS_TOKEN || '',
    }, // will be passed to the page component as props
  }
}

export default GageDetail
