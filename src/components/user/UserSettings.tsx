import React, { useEffect, useState } from 'react';
import { useUserContext } from './userContext';
import { Form, Input } from 'antd';
import { debounce } from 'lodash';

export const UserSettings = () => {
  const { data, updateUser, loading, error } = useUserContext();

  const [form, setForm] = useState();

  const debouncedUpdate = debounce(updateUser, 300);

  useEffect(() => {
    console.log('data: ', data);
  }, [data]);

  if (data) {
    // return <div>{JSON.stringify(data)}</div>;
    return (
      <div>
        <Form
          initialValues={data}
          onValuesChange={(val) => {
            console.log('val: ', Object.values(val)[0]);
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
            <Input />
          </Form.Item>
        </Form>
      </div>
    );
  }

  return <div>user settings</div>;
};
