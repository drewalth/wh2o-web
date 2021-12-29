import {
  Modal,
  Form,
  Button,
  message,
  AutoComplete,
  Select,
  Empty,
  Table,
  Divider,
} from 'antd'
import { Gage, GageReading, GageReadingMetric } from 'types'
import { useEffect, useState } from 'react'
import { addGage, searchGages, getGageReadings } from 'controllers'
import debounce from 'lodash.debounce'
import { FlowChart } from '../flow-chart/flow-chart'
import moment from 'moment'
import { useUserContext } from '../Provider/UserProvider'

interface FlowProps {
  gages: Gage[]
  riverId: number
}

interface SearchOptions {
  label: string
  value: number
}

export const Flow = (props: FlowProps) => {
  const { riverId } = props
  const { isPublisher: userIsPublisher } = useUserContext()
  const [modalVisible, setModalVisible] = useState(false)
  const [form, setForm] = useState(0)
  const [options, setOptions] = useState<SearchOptions[]>()
  const [gages, setGages] = useState<Gage[]>([...props.gages])
  const [activeGage, setActiveGage] = useState(props.gages[0]?.id)
  const [readings, setReadings] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [activeMetric, setActiveMetric] = useState('CFS')
  const [availableMetrics, setAvailableMetrics] = useState<GageReadingMetric[]>(
    [],
  )
  const [tableData, setTableData] = useState<GageReading[]>([])

  const tableColumns = [
    {
      title: 'Reading',
      dataIndex: 'value',
      key: 'value',
      render: (value: string, reading: GageReading) =>
        `${value} ${reading.metric}`,
    },
    {
      title: 'Updated',
      dataIndex: 'createdAt',
      render: (val: Date) => moment(val).format('llll'),
    },
  ]

  const loadReadings = async () => {
    try {
      if (!activeGage) return
      const result = await getGageReadings(activeGage)

      setTableData(result)

      const metrics = new Set(result.map((r) => r.metric))
      // @ts-ignore
      setAvailableMetrics([...metrics])

      setLabels(
        result
          .filter((val: GageReading) => val.metric === activeMetric)
          .map((r) => moment(r.createdAt).format('LLL')),
      )

      const test = result
        .filter((val: GageReading) => val.metric === activeMetric)
        .map((r) => r.value)

      setReadings(test)
    } catch (e) {
      console.log('e', e)
      message.error('Failed to load gage readings')
    }
  }

  useEffect(() => {
    loadReadings()
  }, [activeGage])

  const handleCancel = () => {
    // clear form?
    setModalVisible(false)
  }

  const handleOk = async () => {
    try {
      const result = await addGage({
        gageId: form,
        reachId: riverId,
        primary: !gages.length,
      })
      setGages([...gages, result])
      setModalVisible(false)
      message.success('Gage Added')
    } catch (e) {
      console.log('e', e)
      message.error('Failed to Add Gage')
    }
  }

  const onSearch = async (searchText: string) => {
    try {
      const results = await searchGages(searchText)
      setOptions(
        results.map((val: Gage) => ({ label: val.name, value: val.id })),
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
          height: 24,
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 24,
        }}
      >
        {!!activeGage && (
          <Select
            value={activeGage}
            onSelect={(evt) => setActiveGage(evt as number)}
          >
            {gages.map((gage, index) => (
              <Select.Option key={index} value={gage.id}>
                {gage.name}
              </Select.Option>
            ))}
          </Select>
        )}
        <Button
          type="primary"
          disabled={!userIsPublisher}
          onClick={() => setModalVisible(true)}
        >
          Add Gage
        </Button>
      </div>
      <div>
        {gages.length !== 0 ? (
          <>
            <FlowChart readings={readings} labels={labels} flowRanges={[]} />
            <Divider style={{ marginTop: 64 }} />
            <Table dataSource={tableData} columns={tableColumns} />
          </>
        ) : (
          <Empty description="No gages" />
        )}
      </div>
      <Modal visible={modalVisible} onCancel={handleCancel} onOk={handleOk}>
        <Form initialValues={{ term: '' }}>
          <Form.Item name="term">
            <AutoComplete
              options={options}
              style={{ width: 300 }}
              onSelect={onSelect}
              onSearch={debounce(onSearch, 500)}
              placeholder="Gage name..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
