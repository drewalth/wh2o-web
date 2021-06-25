import { Modal, Form, Button, message, AutoComplete } from 'antd'
import { IGage } from 'interfaces'
import { useAppSelector } from '../../store'
import { selectUserIsPublisher } from '../../store/slices/user.slice'
import { useState } from 'react'
import { searchGages } from '../../controllers'
import debounce from 'lodash.debounce'

interface FlowProps {
  gages: IGage[]
}

interface SearchOptions {
  label: string
  value: number
}

export const Flow = (props: FlowProps) => {
  const userIsPublisher = useAppSelector(selectUserIsPublisher)
  const [modalVisible, setModalVisible] = useState(false)
  const [form, setForm] = useState(0)
  const [options, setOptions] = useState<SearchOptions[]>()

  const handleCancel = () => {
    // clear form?
    setModalVisible(false)
  }

  const handleOk = async () => {
    console.log('add')
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
    setForm(evt)
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 24,
        }}
      >
        <Button
          type="primary"
          disabled={!userIsPublisher}
          onClick={() => setModalVisible(true)}
        >
          Add Gage
        </Button>
      </div>
      <Modal visible={modalVisible} onCancel={handleCancel} onOk={handleOk}>
        <Form initialValues={{ term: '' }}>
          <Form.Item name="term">
            <AutoComplete
              options={options}
              style={{ width: 300 }}
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
