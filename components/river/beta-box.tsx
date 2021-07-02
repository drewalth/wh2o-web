import { Form, Modal, Input, Statistic, Row, Col, Divider, message } from 'antd'
import { useState, useEffect } from 'react'
import moment from 'moment'
import { IRiver } from 'interfaces'
import { updateRiver } from 'controllers'
import { useAppDispatch, useAppSelector } from 'store'
import { fetchRiver } from 'store/slices/river.slice'
import { ContentEditor } from '../content-editor'
import { selectUserIsPublisher } from '../../store/slices/user.slice'

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
  const dispatch = useAppDispatch()
  const userIsPublisher = useAppSelector(selectUserIsPublisher)

  const getPrimaryGage = () => {
    if (!river.gages || !river.gages.length) {
      return 'N/A'
    } else if (river.gages.length) {
      const primaryGage = river.gages.find(
        (g) => g.ReachGages && g.ReachGages.primary
      )

      if (primaryGage) {
        return primaryGage.name
      }

      return river.gages[0].name
    }
  }

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true)
      if (!formRiver) return
      await updateRiver(river.id, formRiver)
      dispatch(fetchRiver(river.id))
      message.success('Reach updated')
    } catch (e) {
      console.log('e', e)
      message.error('Failed to update reach')
    } finally {
      setUpdateLoading(false)
    }
  }

  const updateDescription = (description: string) => {
    // need to use updateReachDto
    // @ts-ignore
    updateRiver(river.id, {
      description,
      id: river.id,
    })
      .then(() => {
        message.success('Content updated')
        console.log('success')
      })
      .catch((e) => {
        message.error('Content failed to update')
        console.log('e', e)
      })
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
              <Statistic title="Length" value={river.length || 'N/A'} />
            </Col>
            <Col span={6}>
              <Statistic title="Quality" value={4.5} />
            </Col>
            <Col span={6} style={{ marginTop: 24 }}>
              <Statistic
                title="Avg Gradient"
                value={river.averageGradient || 'N/A'}
              />
            </Col>
            <Col span={18} style={{ marginTop: 24 }}>
              <Statistic title="Gage" value={getPrimaryGage()} />
            </Col>
          </>
        )}
      </Row>
      <Divider />
      <ContentEditor
        disabled={!userIsPublisher}
        entityId={river.id}
        updateFunction={updateDescription}
        content={river.description || ''}
      />
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
    </>
  )
}
