import { FlowRange } from '../../types'
import { Button, Table, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import React from 'react'

export type FlowRangeTableProps = {
  flowRanges: FlowRange[]
}

const columns = [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: 'Description',
    key: 'id',
    dataIndex: 'id',
    render: (id: number, flowRange: FlowRange) => {
      const { minimum, maximum, metric } = flowRange
      return `${minimum}-${maximum} ${metric}`
    },
  },
  {
    key: 'id',
    dataIndex: 'id',
    render: (id: number) => (
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button size={'small'} danger>
          <DeleteOutlined />
        </Button>
      </div>
    ),
  },
]

export const FlowRangeTable = ({ flowRanges }: FlowRangeTableProps) => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={5}>Flow Ranges</Typography.Title>
      <Table columns={columns} dataSource={flowRanges} />
    </div>
  )
}
