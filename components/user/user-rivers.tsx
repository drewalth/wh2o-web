import {
  removeBookmarkRiver,
  searchRiver,
  userBookmarkRiver,
} from 'controllers'
import debounce from 'lodash.debounce'
import { useState } from 'react'
import {
  message,
  Table,
  Button,
  Row,
  Card,
  Col,
  Modal,
  Form,
  AutoComplete,
} from 'antd'
import { River } from 'types'
import moment from 'moment'
import Link from 'next/link'
import { useRiversContext } from '../Provider/RiversProvider'

interface RiversProps {
  userId: number
  reaches: River[]
}

export const UserRivers = (props: RiversProps) => {
  const { rivers: cachedRivers } = useRiversContext()
  const { userId, reaches } = props
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [rivers, setRivers] = useState<River[]>(reaches)
  const [bookmarkForm, setBookmarkForm] = useState(0)
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    [...cachedRivers].map((el) => ({ label: el.name, value: el.id })),
  )
  const onSearch = async (searchText: string) => {
    try {
      const results = await searchRiver(searchText)
      setOptions(results.map((val) => ({ label: val.name, value: val.id })))
    } catch (e) {
      message.error('Failed to search...')
    }
  }

  const handleAddRiver = async () => {
    try {
      if (!bookmarkForm) return
      const result = await userBookmarkRiver(userId, bookmarkForm)
      setRivers([...rivers, result])
      setModalVisible(false)
      setBookmarkForm(0)
      message.success('River Bookmarked')
    } catch (e) {
      console.log('e', e)
      message.error('Failed to bookmark river.')
    }
  }

  const onSelect = (evt: any) => {
    setBookmarkForm(evt)
  }

  const handleCancel = () => {
    setModalVisible(false)
  }

  const columns = [
    {
      title: 'Name + Section',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, val: River) => (
        <>
          <span style={{ fontWeight: 'bold' }}>{name}</span>
          <br />
          <span>{val.section || ''}</span>
        </>
      ),
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
      render: (updatedAt: Date, val: River) => (
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
      render: (riverId: number) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="small"
            style={{ marginRight: 8 }}
            danger
            onClick={() => handleRemoveBookmark(riverId)}
          >
            Delete
          </Button>
          <Button size="small">
            <Link href={`/rivers/${riverId}`}>View</Link>
          </Button>
        </div>
      ),
    },
  ]

  const handleRemoveBookmark = async (riverId: number) => {
    try {
      await removeBookmarkRiver(userId, riverId)
      setRivers(rivers.filter((r) => r.id !== riverId))
      message.success('Bookmark removed')
    } catch (e) {
      console.log('e', e)
      message.error('Failed to remove bookmark')
    }
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 24,
              }}
            >
              <Button type="primary" onClick={() => setModalVisible(true)}>
                Bookmark River
              </Button>
            </div>
            <div
              style={{ maxWidth: '100%', width: '100%', overflowX: 'scroll' }}
            >
              <Table columns={columns} dataSource={rivers} loading={loading} />
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        visible={modalVisible}
        onCancel={handleCancel}
        onOk={handleAddRiver}
      >
        <Form initialValues={{ term: '' }}>
          <Form.Item name="term">
            <AutoComplete
              options={options}
              style={{ width: 200 }}
              onSelect={onSelect}
              onSearch={debounce(onSearch, 500)}
              placeholder="River name..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}