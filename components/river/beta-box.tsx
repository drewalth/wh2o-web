import {
  Card,
  Descriptions,
  Form,
  Modal,
  Input,
  Statistic,
  Row,
  Col,
  Divider,
} from 'antd'
import { useState, useEffect } from 'react'
import moment from 'moment'
import { IRiver } from 'interfaces'
import { updateRiver } from 'controllers'

interface BetaBoxProps {
  river: IRiver
  loading: boolean
  error: boolean
}

export const BetaBox = (props: BetaBoxProps) => {
  const { river, loading } = props
  const [formRiver, setFormRiver] = useState<IRiver>()
  const [modalVisible, setModalVisible] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true)
      if (!formRiver) return
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const result = await updateRiver(river.id, formRiver)
      console.log(result)
    } catch (e) {
      console.log('e', e)
    } finally {
      setUpdateLoading(false)
    }
  }

  useEffect(() => {
    setFormRiver({ ...river })
  }, [river])

  return (
    <>
      <Row gutter={24}>
        {river && !loading && (
          <>
            <Col span={6}>
              <Statistic
                title="Updated"
                value={
                  !river.updatedAt
                    ? moment(river.createdAt).format('LL')
                    : moment(river.updatedAt).format('LL')
                }
              />
            </Col>
            <Col span={6}>
              <Statistic title="Class" value={river.class} />
            </Col>
            <Col span={6}>
              <Statistic title="Length" value={river.length} />
            </Col>
            <Col span={6}>
              <Statistic title="Quality" value={4.5} />
            </Col>
            <Col span={6} style={{ marginTop: 24 }}>
              <Statistic title="Avg Gradient" value={255} />
            </Col>
            <Col span={18} style={{ marginTop: 24 }}>
              <Statistic title="Gage" value={'SOME SUPER LONG GAGE NAME'} />
            </Col>
          </>
        )}
      </Row>

      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleUpdate}
        confirmLoading={updateLoading}
      >
        <Form
          initialValues={river}
          onValuesChange={(val) => {
            setFormRiver(Object.assign(formRiver, val))
          }}
        >
          <Form.Item label="Class" name="class">
            <Input />
          </Form.Item>
          <Form.Item label="Min Gradient" name="minimumGradient">
            <Input />
          </Form.Item>
          <Form.Item label="Max Gradient" name="maximumGradient">
            <Input />
          </Form.Item>
          <Form.Item label="Avg Gradient" name="averageGradient">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Divider />
    </>
  )
}
