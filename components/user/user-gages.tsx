import { IGage } from 'interfaces'
import { AutoComplete, Button, Card, Form, message, Modal, Table } from 'antd'
import moment from 'moment'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store'
import { fetchGages, selectGagesData } from 'store/slices/gages.slice'
import { removeBookmarkGage, searchGages, userBookmarkGage } from 'controllers'

interface UserGagesProps {
  gages: IGage[]
  userId: number
}

export const UserGages = (props: UserGagesProps) => {
  const { gages, userId } = props
  const dispatch = useAppDispatch()
  const cachedGages = useAppSelector(selectGagesData)
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [formBookmarkGage, setFormBookmarkGage] = useState(0)
  const [options, setOptions] = useState<{ label: string; value: number }[]>([])
  const [deletedGages, setDeletedGages] = useState<number[]>([])
  const [recentlyAdded, setRecentlyAdded] = useState<IGage[]>([])

  const handleDelete = async (gageId: number) => {
    try {
      const result = await removeBookmarkGage(userId, gageId)
      setDeletedGages([...deletedGages, result])
      message.success('Bookmark removed')
    } catch (e) {
      console.log('e', e)
      message.error('Failed to delete')
    }
  }

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
      render: (updatedAt: Date) => (
        <span>{moment(updatedAt).format('LLL')}</span>
      ),
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (gageId: number) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            danger
            onClick={() => handleDelete(gageId)}
            style={{ marginRight: 8 }}
          >
            Delete
          </Button>
          <Button disabled>
            <Link href={`/gages/${gageId}`}>view</Link>
          </Button>
        </div>
      ),
    },
  ]

  const handleOk = async () => {
    try {
      setConfirmLoading(true)
      const result = await userBookmarkGage(
        userId,
        formBookmarkGage,
        !gages.length
      )
      setRecentlyAdded([...recentlyAdded, result])
      message.success('Gage Bookmarked')
      setModalVisible(false)
      setFormBookmarkGage(0)
    } catch (e) {
      console.log('e', e)
      message.error('Something went wrong')
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
    setFormBookmarkGage(0)
  }

  const onSearch = async (searchText: string) => {
    try {
      const results = await searchGages(searchText)
      setOptions(
        results.map((val: IGage) => ({ label: val.name, value: val.id }))
      )
    } catch (e) {
      message.error('Failed to search...')
    }
  }

  const onSelect = (evt: any) => {
    const gage = options.find((g) => g.value === evt)
    if (gage) {
      setFormBookmarkGage(gage.value)
    }
  }

  useEffect(() => {
    if (!cachedGages.length) {
      dispatch(fetchGages())
      onSearch('')
    }
  }, [])

  return (
    <>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 24,
          }}
        >
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Bookmark Gage
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={[...props.gages, ...recentlyAdded].filter(
            (g) => g.id && !deletedGages.includes(g.id)
          )}
        />
      </Card>
      <Modal
        title="Bookmark Gage"
        visible={modalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label="Gage Name" name="gage" rules={[{ required: true }]}>
            <AutoComplete
              options={options}
              style={{ width: 200 }}
              onSelect={onSelect}
              onSearch={onSearch}
              placeholder="input here"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
