import { Feature, FeatureModel } from 'interfaces'
import { useState } from 'react'
import {
  Card,
  Modal,
  Form,
  Input,
  Button,
  Switch,
  message,
  Divider,
  Empty,
  Row,
  Col,
  Select,
  Typography,
} from 'antd'
import { createFeature, updateFeature, deleteFeature } from 'controllers'
import { useAppSelector } from '../../store'
import { selectUserIsPublisher } from '../../store/slices/user.slice'
import { GradeRatings } from '../../lib'

interface FeaturesProps {
  features: Feature[]
  reachId: number | string
}

export const Features = (props: FeaturesProps) => {
  let { reachId } = props
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form, setForm] = useState<Feature>({ ...FeatureModel })
  const [features, setFeatures] = useState<Feature[]>([...props.features])
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
      setSaveError(false)
      setSaveLoading(true)
      const result = await updateFeature(form)

      const index = features.findIndex((el) => el.id === result.id)

      if (index > -1) {
        const ref = [...features]
        ref[index] = result
        setFeatures(ref)
      }

      // if (features.length >= 2) {
      //   //Object.assign(values[valueIndex], item)
      //   const index = features.findIndex((el) => el.id === result.id);
      //   const data = [...features].splice(index, 1, result);
      //   setFeatures(data);
      // } else {
      //   setFeatures([result]);
      // }

      message.success(`Feature updated`)
    } catch (e) {
      console.log('e', e)
      message.error(`Something went wrong...`)
      setSaveError(true)
    } finally {
      setSaveLoading(false)
      if (!saveError) {
        setModalVisible(false)
      }
    }
  }

  const handleSave = async () => {
    try {
      setSaveLoading(true)
      const result = await createFeature(Object.assign({}, form, { reachId }))
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

  const handleInitiateEdit = (feature: Feature) => {
    setForm(feature)
    setModalVisible(true)
  }

  const handleDelete = async (feature: Feature) => {
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
        bodyStyle={{ maxHeight: '70vh', overflowY: 'scroll' }}
      >
        <Form
          initialValues={form}
          onValuesChange={(evt) => setForm(Object.assign({}, form, evt))}
        >
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="class" label="Class">
            <Select>
              {GradeRatings.map((rating) => (
                <Select.Option value={rating}>{rating}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
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
          <Form.Item name="isAccessPoint" label="Access Point">
            <Switch checked={form.isAccessPoint} />
          </Form.Item>
          <Form.Item name="isCampsite" label="Campsite">
            <Switch checked={form.isCampsite} />
          </Form.Item>
          <Form.Item name="isPutIn" label="Put In">
            <Switch checked={form.isPutIn} />
          </Form.Item>
          <Form.Item name="isTakeOut" label="Take Out">
            <Switch checked={form.isTakeOut} />
          </Form.Item>
          <Form.Item name="isHazard" label="Hazard">
            <Switch checked={form.isHazard} />
          </Form.Item>
          <Form.Item name="isPlayspot" label="Surf Spot">
            <Switch checked={form.isPlayspot} />
          </Form.Item>
          <Form.Item name="isPortage" label="Portage">
            <Switch checked={form.isPortage} />
          </Form.Item>
          <Form.Item name="isWaterfall" label="Waterfall">
            <Switch checked={form.isWaterfall} />
          </Form.Item>
          <Form.Item name="isRangerStation" label="Ranger Station">
            <Switch checked={form.isRangerStation} />
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
          onClick={() => {
            setForm({ ...FeatureModel })
            setModalVisible(true)
          }}
        >
          Add Feature
        </Button>
      </div>
      {features &&
        features.length &&
        features.map((feat) => (
          <Card
            title={feat.name}
            style={{ marginBottom: 24 }}
            extra={
              <>
                <Button
                  style={{ marginRight: 8 }}
                  onClick={() => handleInitiateEdit(feat)}
                >
                  Edit
                </Button>
                <Button danger={true} onClick={() => handleDelete(feat)}>
                  Delete
                </Button>
              </>
            }
          >
            <Row>
              <Col
                span={24}
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Typography.Text>{`Class: ${feat.class}`}</Typography.Text>
                <div>
                  {feat.isRapid && <span>Rapid</span>}
                  {feat.isWaterfall && <span>Waterfall</span>}
                  {feat.isPutIn && <span>Put In</span>}
                  {feat.isTakeOut && <span>Takeout</span>}
                  {feat.isAccessPoint && <span>Access Point</span>}
                  {feat.isHazard && <span>Hazard</span>}
                  {feat.isPortage && <span>Portage</span>}
                  {feat.isCampsite && <span>Campsite</span>}
                  {feat.isPlayspot && <span>Surf Spot</span>}
                  {feat.isRangerStation && <span>Ranger Station</span>}
                </div>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={12}>
                {feat.description || 'No description. Log in to add one.'}
              </Col>
            </Row>
          </Card>
        ))}

      {!features.length && <Empty description="No features" />}
    </>
  )
}
