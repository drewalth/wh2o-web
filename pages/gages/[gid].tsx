import { useEffect, useState } from 'react'
import { getGage } from 'controllers'
import { GetServerSideProps } from 'next'
import { Card, Col, Layout, PageHeader, Row, Table } from 'antd'
import { Gage, GageModel, GageReading } from '../../interfaces'
import { useRouter } from 'next/router'
import moment from 'moment'
import { Bookmark, BookmarkEntity } from '../../components/river'

interface GageDetailProps {
  id: string
}

const GageDetail = (props: GageDetailProps) => {
  const router = useRouter()

  const { id } = props

  const [loading, setLoading] = useState(false)
  const [gage, setGage] = useState<Gage>(GageModel)
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
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Description">{gage.description}</Card>
          </Col>
          <Col span={12}>
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
    }, // will be passed to the page component as props
  }
}

export default GageDetail
