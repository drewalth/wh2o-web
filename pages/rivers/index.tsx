import { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Card,
  Layout,
  PageHeader,
  Table,
  Button,
  Form,
  Input,
  message,
} from 'antd'
import moment from 'moment'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from 'store'
import {
  selectRiversData,
  selectRiversLoading,
  fetchRivers,
} from 'store/slices/rivers.slice'
import debounce from 'lodash.debounce'
import { searchRiver } from 'controllers'
import { IRiver } from '../../interfaces'
import { fetchReach } from '../../store/slices/river.slice'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Section',
    dataIndex: 'section',
    key: 'section',
  },
  {
    title: 'Class',
    dataIndex: 'class',
    key: 'class',
  },
  {
    title: 'Updated',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (updatedAt: Date, val: IRiver) => (
      <span>
        {!updatedAt
          ? moment(val.createdAt).format('LL')
          : moment(updatedAt).format('LL')}
      </span>
    ),
  },
  {
    dataIndex: 'id',
    key: 'id',
    render: (gageId: number) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button>
          <Link href={`/rivers/${gageId}`}>view</Link>
        </Button>
      </div>
    ),
  },
]

const Rivers = () => {
  const dispatch = useAppDispatch()
  const rivers = useAppSelector(selectRiversData)
  const loading = useAppSelector(selectRiversLoading)
  const [searchResults, setSearchResults] = useState<IRiver[]>([])

  useEffect(() => {
    if (!rivers.length) {
      dispatch(fetchRivers())
    }
  }, [])

  const submitSearch = async ({ term }: { term: string }) => {
    if (!term) {
      setSearchResults([])
      return
    }

    try {
      const result = await searchRiver(term)
      setSearchResults(result)
    } catch (e) {
      console.log('e', e)
      message.error('Search Failed...')
    }
  }

  return (
    <>
      <PageHeader
        title="Rivers"
        extra={[
          <Button key="1" type="primary">
            Create River
          </Button>,
        ]}
      />
      <Layout.Content style={{ padding: '0 24px' }}>
        <Row>
          <Col span={24}>
            <Card>
              <Form
                onValuesChange={debounce(submitSearch, 500)}
                initialValues={{ term: '' }}
              >
                <Form.Item name="term">
                  <Input placeholder="Search" />
                </Form.Item>
              </Form>
              <Table
                columns={columns}
                dataSource={searchResults.length ? searchResults : rivers}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </>
  )
}

export default Rivers
