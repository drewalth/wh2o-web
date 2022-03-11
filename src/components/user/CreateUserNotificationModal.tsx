import React, { useState } from 'react';
import { Form, Input, Modal, Select, InputNumber, TimePicker } from 'antd';
import {
  CreateNotificationInput,
  GageMetric,
  Notification,
  NotificationChannel,
  NotificationCriteria,
  NotificationInterval
} from '../../types';
import { useUserContext } from './userContext';
import { GageSelect } from '../common/GageSelect';
import moment from 'moment';

export type UserNotificationModalProps = {
  visible: boolean;
  notification?: Notification;
  onCancel: () => void;
};

export const CreateUserNotificationModal = ({ visible, onCancel }: UserNotificationModalProps) => {
  const { data, createNotification } = useUserContext();
  const DEFAULT_FORM = {
    active: false,
    alertTime: undefined,
    channel: NotificationChannel.EMAIL,
    criteria: NotificationCriteria.ABOVE,
    gageDisabled: false,
    interval: NotificationInterval.DAILY,
    maximum: undefined,
    metric: GageMetric.CFS,
    minimum: undefined,
    primary: false,
    userId: data?.id || 0,
    name: ''
  };
  const [formData, setFormData] = useState<CreateNotificationInput>(DEFAULT_FORM);

  return (
    <Modal
      visible={visible}
      onOk={async () => {
        await createNotification({
          ...formData,
          alertTime: formData.alertTime ? moment(formData.alertTime).toDate() : undefined,
          value: formData.value ? Number(formData.value) : null
        });
        onCancel();
      }}
      onCancel={() => {
        setFormData(DEFAULT_FORM);
        onCancel();
      }}
      destroyOnClose
    >
      <Form initialValues={formData} onValuesChange={(val) => setFormData(Object.assign({}, formData, val))}>
        <Form.Item label={'Name'} name={'name'}>
          <Input />
        </Form.Item>

        <Form.Item label={'Interval'} name={'interval'}>
          <Select>
            {Object.values(NotificationInterval).map((int) => (
              <Select.Option key={int} value={int}>
                {int}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={'Channel'} name={'channel'}>
          <Select>
            {Object.values(NotificationChannel).map((channel) => (
              <Select.Option key={channel} value={channel} disabled={channel !== 'EMAIL'}>
                {channel}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={'Gage'} name={'gageId'} hidden={formData.interval !== 'IMMEDIATE'}>
          <GageSelect
            onSelect={(gageId) => {
              setFormData({
                ...formData,
                gageId
              });
            }}
          />
        </Form.Item>
        <Form.Item label={'Criteria'} name={'criteria'} hidden={formData.interval !== 'IMMEDIATE'}>
          <Select>
            {Object.values(NotificationCriteria).map((crit) => (
              <Select.Option key={crit} value={crit}>
                {crit}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={'Value'}
          name={'value'}
          hidden={
            formData.interval !== 'IMMEDIATE' || formData.criteria === 'BETWEEN' || formData.criteria === 'DISABLED'
          }
        >
          <InputNumber min={0} step={0.1} />
        </Form.Item>
        <Form.Item
          label={'Minimum'}
          name={'minimum'}
          hidden={formData.interval !== 'IMMEDIATE' || formData.criteria !== 'BETWEEN'}
        >
          <InputNumber min={0} step={0.1} />
        </Form.Item>
        <Form.Item
          label={'Maximum'}
          name={'maximum'}
          hidden={formData.interval !== 'IMMEDIATE' || formData.criteria !== 'BETWEEN'}
        >
          <InputNumber min={0} step={0.1} />
        </Form.Item>
        <Form.Item
          label={'Metric'}
          name={'metric'}
          hidden={formData.interval !== 'IMMEDIATE' || formData.criteria === 'DISABLED'}
        >
          <Select>
            {Object.values(GageMetric).map((met) => (
              <Select.Option key={met} value={met}>
                {met}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={'Time'} name={'alertTime'} hidden={formData.interval === 'IMMEDIATE'}>
          <TimePicker use12Hours format="h:mm a" minuteStep={5} showNow={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
