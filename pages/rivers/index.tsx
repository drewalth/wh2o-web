import { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Card,
  Layout,
  PageHeader,
  Table,
  Button,
  Form,
  Input,
  Select,
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
  const dispatch = useAppDispatch()
  const rivers = useAppSelector(selectRiversData)
  const loading = useAppSelector(selectRiversLoading)
  const userIsPublisher = useAppSelector(selectUserIsPublisher)
  const [params, setParams] = useState<ReachSearchParams>({
    name: '',
    country: 'US',
  })

  const handleParamChange = (evt: any) => {
    setParams(Object.assign({}, params, evt))
  }

  useEffect(() => {
    dispatch(fetchRivers(params))
  }, [params])

  return (
    <>
      <PageHeader
        title="Rivers"
        extra={
          userIsPublisher && (
            <Button key="1" type="primary">
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
                      {props.activeCountries.map((c) => (
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
    process.env.API_BASE_URL + '/countries'
  ).then((res) => res.json())
  const activeCountries: string[] = await fetch(
    process.env.API_BASE_URL + '/reaches/countries'
  )
    .then((res) => res.json())
    .then((result) => {
      return result
        .map((val: { DISTINCT: string }) => val['DISTINCT'])
        .filter((c: string) => c !== null)
    })

  return {
    props: {
      countriesList,
      activeCountries: countriesList.filter((c) =>
        activeCountries.includes(c.code)
      ),
    },
  }
}
