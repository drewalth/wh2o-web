import { useEffect, useState } from 'react'
import { ArrowRightOutlined } from '@ant-design/icons'
import {
  Row,
  Col,
  Card,
  Layout,
  PageHeader,
  Modal,
  Table,
  Button,
  Form,
  Input,
  Select,
  message,
  Typography,
} from 'antd'
import moment from 'moment'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from 'store'
import {
  selectRiversData,
  selectRiversLoading,
  fetchRivers,
} from 'store/slices/rivers.slice'
import debounce from 'lodash.debounce'
import { ICountry, IRiver, ReachSearchParams } from 'interfaces'
import { GetStaticProps } from 'next'
import { selectUserIsPublisher } from 'store/slices/user.slice'
import { createReach } from 'controllers'
import { useRouter } from 'next/router'
import { selectAppWindowWidth } from '../../store/slices/app.slice'

const ReachFormDefaults = {
  country: 'US',
  name: '',
  section: '',
  class: 'none',
  description: '',
  length: 0,
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string, val: IRiver) => (
      <>
        <Typography.Title
          key={name}
          level={5}
          style={{ fontSize: '0.875rem', lineHeight: 1 }}
        >
          {name}
        </Typography.Title>
        <Typography.Text key={val.section}>{val.section}</Typography.Text>
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
        <Link href={`/rivers/${riverId}`}>
          <a>
            <Button size="small" style={{ paddingTop: 1 }}>
              <ArrowRightOutlined />
            </Button>
          </a>
        </Link>
      </div>
    ),
  },
]

interface RiversProps {
  countriesList: ICountry[]
  activeCountries: ICountry[]
}

const Rivers = (props: RiversProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const windowWidth = useAppSelector(selectAppWindowWidth)
  const rivers = useAppSelector(selectRiversData)
  const loading = useAppSelector(selectRiversLoading)
  const userIsPublisher = useAppSelector(selectUserIsPublisher)
  const [modalVisible, setModalVisible] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [reachForm, setReachForm] = useState({ ...ReachFormDefaults })
  const [params, setParams] = useState<ReachSearchParams>({
    name: '',
    country: 'US',
  })

  const handleParamChange = (evt: any) => {
    setParams(Object.assign({}, params, evt))
  }

  const handleFormChange = (evt: any) => {
    setReachForm(Object.assign({}, reachForm, evt))
  }

  useEffect(() => {
    dispatch(fetchRivers(params))
  }, [params])

  const handleCancel = () => {
    setReachForm({ ...ReachFormDefaults })
    setModalVisible(false)
  }

  const handlOk = async () => {
    try {
      setSaveLoading(true)
      const result = await createReach(reachForm)
      message.success('Reach created.')
      setModalVisible(false)
      await router.push(`/rivers/${result.id}`)
    } catch (e) {
      console.log('e', e)
      message.error('Failed to create reach')
    } finally {
      setSaveLoading(false)
    }
  }

  const getFormInputWidth = () => {
    if (windowWidth > 768) {
      return {
        display: 'inline-block',
        marginRight: 16,
        width: 'calc(20% - 8px)',
      }
    } else {
      return {
        display: 'inline-block',
        marginRight: 16,
        width: 'calc(46% - 8px)',
      }
    }
  }

  return (
    <>
      <PageHeader
        title="Rivers"
        onBack={() => router.push('/')}
        extra={
          <Button
            disabled={!userIsPublisher}
            key="1"
            type="primary"
            onClick={() => setModalVisible(true)}
          >
            Create River
          </Button>
        }
      />
      <Layout.Content style={{ padding: '0 24px' }}>
        <Row>
          <Col span={24}>
            <Card>
              <Form
                onValuesChange={debounce(handleParamChange, 500)}
                initialValues={{ name: '', country: 'US' }}
              >
                <Form.Item>
                  <Form.Item
                    label="River Name"
                    name="name"
                    style={getFormInputWidth()}
                  >
                    <Input placeholder="Search" />
                  </Form.Item>
                  <Form.Item
                    label="Country"
                    name="country"
                    style={getFormInputWidth()}
                  >
                    <Select>
                      <Select.Option value="">--</Select.Option>
                      {props.activeCountries &&
                        props.activeCountries.map((c) => (
                          <Select.Option value={c.code}>{c.name}</Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Form.Item>
              </Form>
              <div style={{ maxWidth: '100%', overflowX: 'scroll' }}>
                <Table
                  columns={columns}
                  dataSource={rivers}
                  loading={loading}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Layout.Content>
      <Modal
        visible={modalVisible}
        onCancel={handleCancel}
        onOk={handlOk}
        destroyOnClose={true}
        confirmLoading={saveLoading}
      >
        <Form initialValues={reachForm} onValuesChange={handleFormChange}>
          <Form.Item label="Country" name="country">
            <Select>
              {props.countriesList &&
                props.countriesList.map((c) => (
                  <Select.Option value={c.code}>{c.name}</Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Section" name="section">
            <Input />
          </Form.Item>
          <Form.Item label="Class" name="class">
            <Input />
          </Form.Item>
          <Form.Item label="Length" name="length">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Rivers

export const getStaticProps: GetStaticProps = async (context) => {
  /**
   * this could become problematic when a user adds a reach
   * to a new country and does not appear in options after creation.
   *
   * Perhaps just cache countries and reach countries responses in redis,
   * then when someone makes a new record, reset redis vals.
   *
   */
  const countriesList: ICountry[] = await fetch(
    process.env.apiBaseUrl + '/countries'
  )
    .then((res) => res.json())
    .catch((e) => {
      console.log(e)
    })

  const activeCountries: string[] = await fetch(
    process.env.apiBaseUrl + '/reaches/countries'
  )
    .then((res) => res.json())
    .then((result) => {
      return result
        .map((val: { DISTINCT: string }) => val['DISTINCT'])
        .filter((c: string) => c !== null)
    })
    .catch((e) => {
      console.log(e)
    })

  return {
    props: {
      countriesList,
      activeCountries: countriesList?.filter((c) =>
        activeCountries.includes(c.code)
      ),
    },
  }
}
