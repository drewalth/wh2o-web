import React from 'react'
import { Button, Table, Tooltip, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { useGagesContext } from '../Provider/GageProvider'
import moment from 'moment'
import { Gage } from '../../types'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const GageTable = (): JSX.Element => {
  const {
    gages,
    pagination,
    setSearchParams,
    searchParams,
    setPagination,
    requestStatus,
  } = useGagesContext()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const columns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, gage: Gage) => (
        <Tooltip title={name} placement={'top'}>
          <Typography.Link
            ellipsis
            onClick={() => navigate(`/gage/${gage.state}/${gage.id}`)}
          >
            {name}
          </Typography.Link>
        </Tooltip>
      ),
    },
    {
      title: t('common.latestReading'),
      dataIndex: 'reading',
      key: 'reading',
      render: (reading: number, gage: Gage) => (
        <div style={{ minWidth: 150 }}>
          {gage.disabled ? t('common.disabled') : `${reading} ${gage.metric}`}
        </div>
      ),
    },
    // {
    //   title: 'Readings',
    //   dataIndex: 'readings',
    //   key: 'readings',
    //   render: (readings: GageReading[], gage: Gage) => (
    //     <div style={{ minWidth: 150 }}>
    //       {/*<ReadingSelect*/}
    //       {/*  readings={readings || []}*/}
    //       {/*  metric={gage.metric}*/}
    //       {/*  disabled={gage.disabled}*/}
    //       {/*/>*/}
    //
    //     </div>
    //   ),
    // },
    {
      title: t('common.updated'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (val: Date) => {
        if (val) {
          return (
            <div style={{ maxWidth: 200 }}>
              <Tooltip title={moment(val).format('llll')}>
                <Typography.Text ellipsis>
                  {moment(val).format('dd hh:mm a')}
                </Typography.Text>
              </Tooltip>
            </div>
          )
        }
        return '-'
      },
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (id: number, gage: Gage) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            title={'View Gage'}
            size={'small'}
            onClick={() => navigate(`/gage/${gage.state}/${id}`)}
            icon={<ArrowRightOutlined />}
          />
        </div>
      ),
    },
  ]

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'scroll' }}>
      <Table
        loading={requestStatus === 'loading'}
        dataSource={gages || []}
        columns={columns}
        pagination={{
          total: pagination.total,
          showSizeChanger: true,
          current: pagination.page,
          pageSize: pagination.page_size,
          pageSizeOptions: [10, 25, 50],
          onChange: (page, page_size) => {
            setSearchParams({
              ...searchParams,
            })
            setPagination({ page_size, page, total: pagination.total })
          },
        }}
      />
    </div>
  )
}

export default GageTable
