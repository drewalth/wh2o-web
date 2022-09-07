import React from 'react'
import { Button, Popover, Table, Tooltip, Typography } from 'antd'
import { useGagesContext } from '../Provider/GageProvider'
import moment from 'moment'
import { Gage } from '../../types'
import { useNavigate } from 'react-router-dom'
import { GageBookmarkToggle } from '../Common/GageBookmarkToggle'
import { GageReadingsChart } from './GageReadingsChart'
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share'
import {
  FacebookOutlined,
  MailOutlined,
  ShareAltOutlined,
  TwitterOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const shareButtons = (gage: Gage) => {
  const url = `https://wh2o.io/gage/${gage.id}`
  return (
    <div style={{ fontSize: '2rem', display: 'flex' }}>
      <EmailShareButton
        url={url}
        style={{ marginRight: 8 }}
        subject={`${gage.name} @ ${gage.reading} ${gage.metric}`}
      >
        <MailOutlined />
      </EmailShareButton>
      <FacebookShareButton url={url} style={{ marginRight: 8 }}>
        <FacebookOutlined />
      </FacebookShareButton>
      <TwitterShareButton url={url}>
        <TwitterOutlined />
      </TwitterShareButton>
    </div>
  )
}

type GageShareProps = {
  gage: Gage
}

const GageShare = ({ gage }: GageShareProps) => {
  const { t } = useTranslation()
  return (
    <Popover content={shareButtons(gage)} trigger="click">
      <Button style={{ marginRight: 8 }} title={t('share')}>
        <ShareAltOutlined />
      </Button>
    </Popover>
  )
}

const GageTable = (): JSX.Element => {
  const { gages, pagination, requestStatus, fetchGages, searchParams } =
    useGagesContext()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, gage: Gage) => (
        <Tooltip title={name} placement={'top'}>
          <Typography.Link
            ellipsis
            id={gage.id.toString()}
            onClick={() => navigate(`/gage/${gage.id}`)}
          >
            {name}
          </Typography.Link>
        </Tooltip>
      ),
    },
    {
      title: t('latestReading'),
      dataIndex: 'reading',
      key: 'reading',
      render: (reading: number, gage: Gage) => (
        <div style={{ minWidth: 150 }}>
          {gage.disabled ? `Disabled` : `${reading} ${gage.metric}`}
        </div>
      ),
    },
    {
      title: t('updated'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (val: Date) => {
        if (val) {
          return (
            <div style={{ maxWidth: 200 }}>
              <Tooltip title={moment(val).format('llll')}>
                <Typography.Text ellipsis>
                  {moment(val).format('ddd hh:mm a')}
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
      render: (id: string, gage: Gage) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <GageShare gage={gage} />
          <GageBookmarkToggle gageId={id} type={'icon'} />
        </div>
      ),
    },
  ]

  return (
    <Table
      rowKey={(row) => row.id}
      expandable={{
        expandedRowRender: (g) => (
          <GageReadingsChart readings={g.readings || []} metric={g.metric} />
        ),
        rowExpandable: (g) => (g.readings && g.readings.length > 0) || false,
      }}
      loading={requestStatus === 'loading'}
      dataSource={gages || []}
      columns={columns}
      pagination={{
        total: pagination.total,
        showSizeChanger: true,
        current: pagination.page,
        pageSize: pagination.page_size,
        pageSizeOptions: [25, 50, 100],
        onChange: (page, page_size) =>
          fetchGages({ ...searchParams, page, page_size }),
      }}
    />
  )
}

export default GageTable
