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
import { IRiver } from 'interfaces'
import moment from 'moment'
import Link from 'next/link'
import { useAppSelector } from 'store'
import { selectRiversData } from 'store/slices/rivers.slice'

interface RiversProps {
  userId: number
  reaches: IRiver[]
}

export const Rivers = (props: RiversProps) => {
  const { userId, reaches } = props
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [rivers, setRivers] = useState<IRiver[]>(reaches)
  const [bookmarkForm, setBookmarkForm] = useState(0)
  const cachedRivers = useAppSelector(selectRiversData)
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    [...cachedRivers].map((el) => ({ label: el.name, value: el.id }))
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
      render: (riverId: number) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            style={{ marginRight: 8 }}
            danger
            onClick={() => handleRemoveBookmark(riverId)}
          >
            Delete
          </Button>
          <Button>
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
            <Table columns={columns} dataSource={rivers} loading={loading} />
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
