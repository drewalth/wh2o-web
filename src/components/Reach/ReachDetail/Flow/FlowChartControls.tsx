import { useFlowContext } from './FlowContext'
import { Select, Form } from 'antd'
import { DateFormat } from '../../../../enums'

export const FlowChartControls = () => {
  const {
    availableMetrics,
    setMetric,
    gages,
    gage,
    setGage,
    metric,
    dateFormat,
    setDateFormat,
  } = useFlowContext()

  return (
    <Form layout="vertical">
      <Form.Item>
        <Select
          value={gage?.id}
          onChange={(val) => {
            console.log(val)

            const g = gages.find((el) => el.id === val)

            g && setGage(g)
          }}
        >
          {gages.map((g) => (
            <Select.Option key={g.id} value={g.id}>
              {g.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Select value={metric} onChange={(me) => setMetric(me)}>
          {availableMetrics.map((m) => (
            <Select.Option value={m} key={m}>
              {m}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Select value={dateFormat} onChange={(d) => setDateFormat(d)}>
          {Object.values(DateFormat).map((df) => (
            <Select.Option value={df} key={df}>
              {df}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  )
}
