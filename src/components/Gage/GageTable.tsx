import React from 'react'
import moment from 'moment'
import { Button, notification, Table, Tooltip, Typography } from 'antd'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { useGagesContext } from '../Provider/GageProvider'
import { Gage } from '../../types'
import { useNavigate } from 'react-router-dom'
import { addUserGage, removeUserGage } from '../../controllers'
import { useUserContext } from '../User/UserContext'

type Props = {
  siteIds?: string[]
}

const GageTable = ({ siteIds }: Props): JSX.Element => {
  const { user, reload } = useUserContext()
  const {
    gages,
    pagination,
    setSearchParams,
    searchParams,
    setPagination,
    requestStatus,
  } = useGagesContext()
  const navigate = useNavigate()

  const addFavoriteGage = async (gage: Gage) => {
    try {
      await addUserGage(gage.id, user?.id ?? 0)
      notification.success({
        message: `Added ${gage.name} to favorites`,
        placement: 'bottomRight',
      })
      await reload()
    } catch (e) {
      notification.error({
        message: `Failed to add ${gage.name} to favorites`,
        placement: 'bottomRight',
      })
    }
  }

  const removeFavoriteGage = async (gage: Gage) => {
    try {
      await removeUserGage(gage.id, user?.id ?? 0)
      notification.success({
        message: `Removed ${gage.name} from favorites`,
        placement: 'bottomRight',
      })
      await reload()
    } catch (e) {
      notification.error({
        message: `Failed to remove ${gage.name} from favorites`,
        placement: 'bottomRight',
      })
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, gage: Gage) => (
        <Tooltip title={name} placement={'top'}>
          <Typography.Link
            onClick={() => navigate(`/explore/${gage.state}/${gage.id}`)}
          >
            {name}
          </Typography.Link>
        </Tooltip>
      ),
    },
    {
      title: 'Latest Reading',
      dataIndex: 'reading',
      key: 'reading',
      responsive: ['sm' as const],
      render: (reading: number, gage: Gage) => (
        <div style={{ minWidth: 150 }}>
          {gage.disabled ? `Disabled` : `${reading} ${gage.metric}`}
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
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      responsive: ['md' as const],
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
      dataIndex: 'favorite',
      key: 'favorite',
      render: (siteId: number, gage: Gage) => {
        const isVerified = Boolean(user?.verified)
        const isFavorited =
          user?.gages.find((g) => g.id === gage.id) !== undefined
        const tooltip = isFavorited
          ? 'Remove from favorites'
          : 'Add to favorites'
        const icon = isFavorited ? (
          <StarFilled style={{ color: 'gold' }} />
        ) : (
          <StarOutlined style={{ color: 'gray' }} />
        )

        return (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip
              title={isVerified ? tooltip : 'Please verify your account'}
            >
              <Button
                title={'Favorite Gage'}
                shape="circle"
                onClick={async () => {
                  if (isFavorited) {
                    await removeFavoriteGage(gage)
                  }
                  await addFavoriteGage(gage)
                }}
                icon={icon}
                type="text"
                disabled={!isVerified}
              />
            </Tooltip>
          </div>
        )
      },
    },
  ]

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'scroll' }}>
      <Table
        loading={requestStatus === 'loading'}
        dataSource={
          siteIds !== undefined
            ? gages.filter((g) => siteIds.includes(g.siteId))
            : gages || []
        }
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
