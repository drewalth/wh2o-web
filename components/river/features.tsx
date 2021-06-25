import { IFeature, FeatureModel } from 'interfaces'
import { useState } from 'react'
import { Card, Modal, Form, Input, Button, Switch, message } from 'antd'
import { createFeature, updateFeature, deleteFeature } from 'controllers'
import { useAppSelector } from '../../store'
import { selectUserIsPublisher } from '../../store/slices/user.slice'

interface FeaturesProps {
  features: IFeature[]
  riverId: number | string
}

export const Features = (props: FeaturesProps) => {
  let { features: data, riverId } = props
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form, setForm] = useState<IFeature>({ ...FeatureModel })
  const [features, setFeatures] = useState<IFeature[]>([...data])
  const userIsPublisher = useAppSelector(selectUserIsPublisher)

  const handleSubmit = async () => {
    if (form.id) {
      await handleUpdate()
    } else {
      await handleSave()
    }
  }

  const handleUpdate = async () => {
    try {
      setSaveLoading(true)
      const result = await updateFeature(form)
      const index = features.findIndex((el) => el.id === result.id)
      features.splice(index, 1, result) // bad practice?
      setModalVisible(false)
      message.success(`Feature updated`)
    } catch (e) {
      console.log('e', e)
      message.error(`Something went wrong...`)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaveLoading(true)
      const result = await createFeature(Object.assign({}, form, { riverId }))
      setFeatures([...features, result])
      setModalVisible(false)
      message.success(`Feature created`)
    } catch (e) {
      console.log('e', e)
      message.error(`Something went wrong...`)
      setSaveError(true)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleCancel = async () => {
    setForm({ ...FeatureModel })
    setModalVisible(false)
  }

  const handleInitiateEdit = (feature: IFeature) => {
    setForm(feature)
    setModalVisible(true)
  }

  const handleDelete = async (feature: IFeature) => {
    try {
      if (feature && feature.id) {
        const result = await deleteFeature(feature.id)
        setFeatures(features.filter((val) => val.id !== result.id))
        message.success(`Feature Deleted`)
      }
    } catch (e) {
      console.log('e', e)
      message.error(`Something went wrong...`)
    }
  }

  return (
    <>
      <Modal
        visible={modalVisible}
        confirmLoading={saveLoading}
        onOk={handleSubmit}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form
          initialValues={form}
          onValuesChange={(evt) => setForm(Object.assign({}, form, evt))}
        >
          <Form.Item name="name" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="distance" label="Distance">
            <Input />
          </Form.Item>
          <Form.Item name="latitude" label="Latitude">
            <Input />
          </Form.Item>
          <Form.Item name="longitude" label="Longitude">
            <Input />
          </Form.Item>
          <Form.Item name="isRapid" label="Rapid">
            <Switch checked={form.isRapid} />
          </Form.Item>
        </Form>
      </Modal>
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
          Add Feature
        </Button>
      </div>
      {features &&
        features.map((feat) => (
          <Card
            title={feat.name}
            style={{ marginBottom: 24 }}
            extra={
              <>
                <Button onClick={() => handleInitiateEdit(feat)}>Edit</Button>
                <Button onClick={() => handleDelete(feat)}>Delete</Button>
              </>
            }
          >
            <Card.Meta description={feat.description}></Card.Meta>
          </Card>
        ))}
    </>
  )
}
