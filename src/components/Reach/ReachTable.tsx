import React from 'react'
import { Table, Typography } from 'antd'
import { useReachContext } from '../Provider/ReachProvider/ReachContext'
import { useNavigate } from 'react-router-dom'
import { Reach } from '../../types'

export const ReachTable = () => {
  const { reaches } = useReachContext()
  const navigate = useNavigate()

  const columns = [
    {
      key: 'name',
      dataIndex: 'name',
      render: (name: string, reach: Reach) => (
        <Typography.Link onClick={() => navigate(`/reach/${reach.id}`)}>
          {name}
        </Typography.Link>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={reaches}
      rowKey={(record) => record.id}
    />
  )
}
