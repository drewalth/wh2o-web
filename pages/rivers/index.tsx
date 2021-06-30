import { useEffect, useState } from 'react'
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
    render: (gageId: number) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button>
          <Link href={`/rivers/${gageId}`}>view</Link>
        </Button>
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

  return (
    <>
      <PageHeader
        title="Rivers"
        extra={
          userIsPublisher && (
            <Button
              key="1"
              type="primary"
              onClick={() => setModalVisible(true)}
            >
              Create River
            </Button>
          )
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
                    style={{
                      display: 'inline-block',
                      width: 'calc(50% - 8px)',
                    }}
                  >
                    <Input placeholder="Search" />
                  </Form.Item>
                  <Form.Item
                    label="Country"
                    name="country"
                    style={{
                      display: 'inline-block',
                      width: 'calc(50% - 8px)',
                    }}
                  >
                    <Select>
                      {props.activeCountries && props.activeCountries.map((c) => (
                        <Select.Option value={c.code}>{c.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form.Item>
              </Form>
              <Table columns={columns} dataSource={rivers} loading={loading} />
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
              {props.countriesList && props.countriesList.map((c) => (
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
