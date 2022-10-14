import React, { useState, useEffect } from 'react'
import { Select, Form, Typography } from 'antd'
import { GageReading, GageMetric } from '../../types'

type ReadingSelectProps = {
  readings?: GageReading[]
  metric: GageMetric
  disabled: boolean
}

/**
 *
 * @todo this component is kinda busted...
 * @param readings
 * @param metric
 * @param disabled
 * @constructor
 */

export const ReadingSelect = ({
  readings,
  metric,
  disabled,
}: ReadingSelectProps): JSX.Element => {
  const [activeMetric, setAcitveMetric] = useState<GageMetric>(metric)
  const [reading, setReading] = useState<number>()
  const metrics = Array.from(new Set(readings?.map((r) => r.metric)))

  useEffect(() => {
    const val = readings?.filter((r) => r.metric === activeMetric)[0]?.value

    setReading(val)
    setAcitveMetric(metric)
  }, [activeMetric, readings, metric])

  const formatReading = (reading) => {
    if (reading) {
      return String(reading)
    }

    return '-'
  }

  const formattedReading = formatReading(reading)

  if (
    !readings ||
    readings.length === 0 ||
    disabled ||
    formattedReading === '-'
  ) {
    return <>-</>
  }

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', maxHeight: 32 }}>
      <Typography.Text>{formatReading(reading)}</Typography.Text>

      <div>
        <Form
          initialValues={{
            metric,
          }}
          preserve={false}
        >
          <Form.Item name={'metric'}>
            <Select
              bordered={false}
              size={'small'}
              onSelect={(val: string) => setAcitveMetric(val as GageMetric)}
            >
              {metrics.map((m, index) => (
                <Select.Option key={m + index} value={m}>
                  {m}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
