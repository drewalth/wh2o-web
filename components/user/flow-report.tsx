import { Gage, User } from 'types'
import { Row, Col, Button, Modal, AutoComplete, Form, Card } from 'antd'
import { useEffect, useState } from 'react'
import { removeBookmarkGage, userBookmarkGage } from 'controllers'
import { FlowChartV2 } from '../flow-chart/flow-chart-v2'
import {useGagesContext} from "../Provider/GagesProvider";
import {useUserContext} from "../Provider/UserProvider";

interface FlowReportProps {
  gages: Gage[]
}

export const FlowReport = (props: FlowReportProps) => {
  const {gages, loadGages} = useGagesContext()
  const {user, loadUser} = useUserContext()
  const userGages = props.gages
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [options, setOptions] = useState<{ value: string }[]>(
    gages.map((gage) => ({ value: gage.name }))
  )
  const [formGageBookmark, setFormGageBookMark] = useState(0)

  const onSearch = (searchText: string) => {
    const searchPayload = !searchText
      ? gages.map((gage) => ({ value: gage.name }))
      : gages
          .map((gage) => ({ value: gage.name }))
          .filter((el) =>
            el.value.toLowerCase().includes(searchText.toLowerCase())
          )

    setOptions(searchPayload)
  }

  const handleDelete = async (gageId: number) => {
    try {
      if (!user) return
      await removeBookmarkGage(user.id, gageId)
      if (user && user.id) {
        await loadUser(user.id)
      }
    } catch (e) {
      console.log('e', e)
    }
  }

  const onSelect = (evt: any) => {
    const gage = gages.find((g) => g.name === evt)

    if (gage && gage.id) {
      setFormGageBookMark(gage.id)
    }
  }

  const showModal = () => {
    setVisible(true)
  }

  const handleOk = async () => {
    try {
      if (!user) return
      setConfirmLoading(true)
      await userBookmarkGage(user.id, formGageBookmark, true)
    } catch (e) {
      console.log('e', e)
    } finally {
      setConfirmLoading(false)
      setVisible(false)
      if (user && user.id) {
        await loadUser(user.id)
      }
    }
  }

  const handleCancel = () => {
    setVisible(false)
  }

  useEffect(() => {
    (async () => {
      if (!gages.length) {
        await loadGages()
        onSearch('')
      }
    })()
  }, [])

  const placeholderBlockStyle = {
    minHeight: 250,
    backgroundColor: '#ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  }

  const columnStyle = {
    marginBottom: 24,
  }

  return (
    <>
      <Row gutter={24}>
        <Col span={24} lg={24} xl={18} style={columnStyle}>
          {userGages && userGages.length ? (
            <Card
              extra={
                <>
                  <Button danger={true}>Delete</Button>
                </>
              }
            >
              <FlowChartV2 readings={[]} labels={[]} flowRanges={[]} />
            </Card>
          ) : (
            <div style={placeholderBlockStyle}>
              <Button type="primary" onClick={showModal}>
                Bookmark Gage
              </Button>
            </div>
          )}
        </Col>
        <Col span={24} lg={24} xl={6}>
          <Row gutter={24}>
            <Col span={24} lg={12} xl={24} style={columnStyle}>
              <Card title="Alerts">
                <p>lorem</p>
              </Card>
            </Col>
            <Col span={24} lg={12} xl={24}>
              <Card title="Alerts">
                <p>lorem</p>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Modal
            title="Bookmark Gage"
            visible={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Form>
              <Form.Item
                label="Gage Name"
                name="gage"
                rules={[{ required: true }]}
              >
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
        </Col>
      </Row>
    </>
  )
}
