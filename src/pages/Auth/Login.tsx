import React, { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from 'antd'
import { setToken } from '../../lib/token'
import { useUserContext } from '../user/userContext'
import { Link, navigate } from 'gatsby'
import { authColSpan } from './defaults'

export const Login = () => {
  return (
    <Row justify={'center'}>
      <Col {...authColSpan}>
        <Card title={'Login'}>
          <Form
            name="basic"
            initialValues={form}
            onFinish={async () => {
              await handleLogin({
                variables: {
                  authLoginInput: form,
                },
              }).then(async ({ data }) => {
                setAuthToken(data?.login.token || '')
                await user.decodeJwt()
                await user.loadUser()
                // history.replace('/user');
                await navigate('/user')
              })
            }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            onValuesChange={(val) => setForm(Object.assign({}, form, val))}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder={'Email'} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder={'Password'} />
            </Form.Item>

            {/*<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>*/}
            {/*  <Checkbox>Remember me</Checkbox>*/}
            {/*</Form.Item>*/}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Space direction={'horizontal'} size={'middle'}>
            <Link to={'/auth/request-access'}>
              <Typography.Link>Request Access</Typography.Link>
            </Link>
            <Link to={'/auth/forgot'}>
              <Typography.Link>Forgot Password</Typography.Link>
            </Link>
          </Space>
        </Card>
      </Col>
    </Row>
  )
}
