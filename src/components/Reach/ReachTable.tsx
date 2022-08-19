import React from 'react'
import { Table, Typography } from 'antd'
import { useReachContext } from '../Provider/ReachProvider/ReachContext'
import { useNavigate } from 'react-router-dom'
import { Gage, Reach } from '../../types'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { DateFormat } from '../../enums'

const getGageInfo = (gages?: Gage[]) => {
  if (gages && gages.length > 0) {
    const g = gages[0]

    return (
      <Typography.Text>{`${g.reading} ${g.metric} @ ${moment(
        g.updatedAt,
      ).format(DateFormat.LLLL)}`}</Typography.Text>
    )
  }

  return 'n/a'
}

export const ReachTable = () => {
  const { reaches } = useReachContext()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: `${t('name')} & ${t('section')}`,
      render: (name: string, reach: Reach) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <Typography.Link onClick={() => navigate(`/reach/${reach.id}`)}>
            {name}
          </Typography.Link>
          <Typography.Text>{reach.section}</Typography.Text>
        </div>
      ),
    },
    {
      key: 'grade',
      dataIndex: 'grade',
      title: t('grade'),
    },
    {
      key: 'gages',
      dataIndex: 'gages',
      title: t('latestReading'),
      render: (gages: Gage[]) => getGageInfo(gages),
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
