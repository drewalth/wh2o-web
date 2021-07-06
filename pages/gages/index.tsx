import { useEffect } from 'react'
import { Row, Col, Card, Layout, PageHeader, Table, Button } from 'antd'
import moment from 'moment'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from 'store'
import {
  selectGagesData,
  fetchGages,
  selectGagesLoading,
} from 'store/slices/gages.slice'
import { useRouter } from 'next/router'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },

  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: 'Latest Reading',
    dataIndex: 'latestReading',
    key: 'latestReading',
  },
  {
    title: 'Updated',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (updatedAt: Date) => <span>{moment(updatedAt).format('LLL')}</span>,
  },
  {
    dataIndex: 'id',
    key: 'id',
    render: (gageId: number) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button disabled>
          <Link href={`/gages/${gageId}`}>view</Link>
        </Button>
      </div>
    ),
  },
]

const Gages = () => {
  const dispatch = useAppDispatch()
  const gages = useAppSelector(selectGagesData)
  const gagesLoading = useAppSelector(selectGagesLoading)
  const router = useRouter()

  useEffect(() => {
    if (!gages.length) {
      dispatch(fetchGages())
    }
  }, [])

  return (
    <>
      <PageHeader
        title="Gages"
        onBack={() => router.push('/')}
        extra={[
          <Button key="1" type="primary" disabled>
            Create Gage
          </Button>,
        ]}
      />
      <Layout.Content style={{ padding: '0 24px' }}>
        <Row>
          <Col span={24}>
            <Card>
              <Table
                columns={columns}
                dataSource={gages}
                loading={gagesLoading}
              />
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </>
  )
}

export default Gages
