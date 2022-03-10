import React, { useState } from 'react';
import { Table, Button, Tag, Tooltip, Typography } from 'antd';
import { useUserContext } from './userContext';
import { Notification, NotificationChannel, NotificationInterval } from '../../types';
import { DeleteOutlined } from '@ant-design/icons';
import { CreateUserNotificationModal } from './CreateUserNotificationModal';
import moment from 'moment';

const getIntervalTag = (interval: NotificationInterval) => {
  let color = 'blue';

  if (interval === 'WEEKLY') {
    color = 'yellow';
  }

  if (interval === 'MONTHLY') {
    color = 'gold';
  }

  if (interval === 'IMMEDIATE') {
    color = 'red';
  }

  return (
    <Tooltip placement="top" title={'Interval'}>
      <Tag color={color}>{interval}</Tag>
    </Tooltip>
  );
};

const getChannelTag = (channel: NotificationChannel) => {
  let color = 'blue';

  if (channel === 'SMS') {
    color = 'green';
  }

  return (
    <Tooltip placement="top" title={'Channel'}>
      <Tag color={color}>{channel}</Tag>
    </Tooltip>
  );
};

const getCriteria = (notification: Notification) => {
  if (notification.interval === 'DAILY')
    return (
      <>
        <Typography.Text type={'secondary'} style={{ marginRight: 8 }}>
          @
        </Typography.Text>
        <Tooltip placement="top" title={'Channel'}>
          <Tag color={'geekblue'}>{moment(notification.alertTime).format('hh:mm a')}</Tag>
        </Tooltip>
      </>
    );

  const getValues = () => {
    if (notification.criteria === 'BETWEEN') {
      return (
        <Tooltip placement="top" title={'Between'}>
          <Tag color={'geekblue'}>{`${notification.minimum}-${notification.maximum} ${notification.metric}`}</Tag>
        </Tooltip>
      );
    }
    return (
      <Tooltip placement="top" title={'Criteria'}>
        <Tag color={'geekblue'}>{`${notification.value} ${notification.metric}`}</Tag>
      </Tooltip>
    );
  };

  return (
    <>
      <Typography.Text type={'secondary'} style={{ marginRight: 8 }}>
        when
      </Typography.Text>
      <Tooltip placement="top" title={notification.gage?.name}>
        <div style={{ maxWidth: 200 }}>
          <Typography.Text style={{ marginRight: 8 }} ellipsis>
            {notification.gage?.name}
          </Typography.Text>
        </div>
      </Tooltip>
      <Tooltip placement="top" title={'Criteria'}>
        <Tag color={'geekblue'}>{notification.criteria}</Tag>
      </Tooltip>
      {getValues()}
    </>
  );
};

export const UserNotifications = () => {
  const { data, removeNotification } = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<Notification | undefined>(undefined);

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, note: Notification) => (name ? name : 'Untitled')
    },
    {
      title: 'Description',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, notification: Notification) => {
        return (
          <div style={{ display: 'flex' }}>
            {getIntervalTag(notification.interval)}
            {getChannelTag(notification.channel)}
            {getCriteria(notification)}
          </div>
        );
      }
    },
    {
      title: 'Last Sent',
      dataIndex: 'lastSent',
      key: 'lastSent',
      render: (lastSent: Date) => (lastSent ? lastSent : '-')
    },
    {
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button danger size={'small'} onClick={() => removeNotification(id)}>
            <DeleteOutlined />
          </Button>
        </div>
      )
    }
  ];

  if (data) {
    return (
      <>
        <CreateUserNotificationModal
          visible={modalVisible}
          notification={pendingEdit}
          onCancel={() => {
            setPendingEdit(undefined);
            setModalVisible(false);
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button onClick={() => setModalVisible(true)}>Add Notification</Button>
        </div>
        <Table dataSource={data.notifications} columns={tableColumns} />
      </>
    );
  }

  return null;
};
