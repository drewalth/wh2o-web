import { Gage, GageReading } from 'interfaces'
import { AutoComplete, Button, Card, Form, message, Modal, Table } from 'antd'
import moment from 'moment'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'store'
import { fetchGages, selectGagesData } from 'store/slices/gages.slice'
import { removeBookmarkGage, searchGages, userBookmarkGage } from 'controllers'

interface UserGagesProps {
  gages: Gage[]
  userId: number
}

export const UserGages = (props: UserGagesProps) => {
  const { gages, userId } = props
  const dispatch = useAppDispatch()
  const cachedGages = useAppSelector(selectGagesData)
  const [modalVisible, setModalVisible] = useState(false)
  const [saveEnabled, setSaveEnabled] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [formBookmarkGage, setFormBookmarkGage] = useState(0)
  const [options, setOptions] = useState<{ label: string; value: number }[]>([])
  const [deletedGages, setDeletedGages] = useState<number[]>([])
  const [recentlyAdded, setRecentlyAdded] = useState<Gage[]>([])

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

  const getDescription = (gage: Gage) => {
    let latestMetric = ''

    const metrics = ['CFS', 'TEMP', 'FT', 'CMS']

    for (const metric of metrics) {
      if (gage.latestReading?.includes(metric)) {
        latestMetric = metric
        break
      }
    }

    if (latestMetric) {
      const readings =
        gage.readings?.filter((r) => r.metric === latestMetric) || []

      const latest = readings[0].value
      const previous = readings[1].value
      const difference = latest - previous

      if (difference) {
        if (String(difference).charAt(0) === '-') {
          return `${gage.latestReading} [ ${difference} ]`
        } else {
          return `${gage.latestReading} [ +${difference} ]`
        }
      }
    }

    return `${gage.latestReading}`
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
      render: (reading: string, val: Gage) => getDescription(val),
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
            size="small"
            danger
            onClick={() => handleDelete(gageId)}
            style={{ marginRight: 8 }}
          >
            Delete
          </Button>
          <Button size="small">
            <Link href={`/gages/${gageId}`}>View</Link>
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
        results.map((val: Gage) => ({ label: val.name, value: val.id }))
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
        <Form layout={'vertical'}>
          <Form.Item name="gage" rules={[{ required: true }]}>
            <AutoComplete
              options={options}
              onSelect={onSelect}
              onSearch={onSearch}
              placeholder="Gage Name"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
