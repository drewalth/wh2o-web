import { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Card,
  Layout,
  PageHeader,
  Table,
  Button,
  message,
  Form,
  Input,
} from 'antd'
import moment from 'moment'
import Link from 'next/link'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import { Gage } from 'types'
import { searchGages } from '../../controllers'
import { useGagesContext } from '../../components/Provider/GagesProvider'

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
        <Link href={`/gages/${gageId}`}>
          <Button>View</Button>
        </Link>
      </div>
    ),
  },
]

const Gages = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Gage[]>()
  const { gages, requestStatus, loadGages } = useGagesContext()

  const handleSearch = async () => {
    if (!searchTerm) return
    try {
      const results = await searchGages(searchTerm)
      setSearchResults(results)
    } catch (e) {
      console.log(e)
      message.error('Failed to search')
    }
  }

  useEffect(() => {
    ;(async () => {
      await handleSearch()
    })()
  }, [searchTerm])

  useEffect(() => {
    ;(async () => {
      if (!gages.length) {
        await loadGages()
      }
    })()
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
              <Form
                onValuesChange={debounce(
                  ({ term }) => setSearchTerm(term),
                  500,
                )}
              >
                <Form.Item name="term">
                  <Input />
                </Form.Item>
              </Form>
              <Table
                columns={columns}
                dataSource={searchTerm ? searchResults : gages}
                loading={requestStatus === 'loading'}
              />
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </>
  )
}

export default Gages
