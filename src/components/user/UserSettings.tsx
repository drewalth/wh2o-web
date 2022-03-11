import React, { useEffect } from 'react';
import { useUserContext } from './userContext';
import { Form, Input, Select } from 'antd';
import { debounce } from 'lodash';
import timezones from '../../helpers/timezones';

export const UserSettings = () => {
  const { data, updateUser } = useUserContext();

  const debouncedUpdate = debounce(updateUser, 300);

  useEffect(() => {
    console.log('data: ', data);
  }, [data]);

  if (data) {
    return (
      <div>
        <Form
          initialValues={data}
          onValuesChange={(val) => {
            // @ts-ignore
            debouncedUpdate(Object.keys(val)[0], Object.values(val)[0]);
          }}
        >
          <Form.Item name={'firstName'} label={'First Name'}>
            <Input />
          </Form.Item>
          <Form.Item name={'lastName'} label={'Last Name'}>
            <Input />
          </Form.Item>
          <Form.Item name={'email'} label={'Email'}>
            <Input />
          </Form.Item>
          <Form.Item name={'timezone'} label={'Timezone'}>
            <Select>
              {timezones.map((tz) => (
                <Select.Option key={tz} value={tz}>
                  {tz}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  }

  return <div>user settings</div>;
};
