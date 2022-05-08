import { FlowRange } from '../../types'
import { Button, Table, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type FlowRangeTableProps = {
  flowRanges: FlowRange[]
}

export const FlowRangeTable = ({ flowRanges }: FlowRangeTableProps) => {
  const { t } = useTranslation()
  const columns = [
    {
      title: t('name'),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: t('description'),
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
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={5}>{t('flowRanges')}</Typography.Title>
      <Table columns={columns} dataSource={flowRanges} />
    </div>
  )
}
