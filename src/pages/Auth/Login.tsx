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
import { authColSpan } from './defaults'
import { Link, useNavigate } from 'react-router-dom'
import { authLogin } from '../../controllers'
import { setToken } from '../../lib/token'
import { useUserContext } from '../../components/User/UserContext'

export const Login = () => {
  const [form, setForm] = useState({})
  const { setUser } = useUserContext()
  const navigate = useNavigate()
  const handleSubmit = async () => {
    try {
      const { user, token } = await authLogin(form)
      setUser(user)
      setToken(token)
      navigate('/')
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <Row justify={'center'}>
      <Col {...authColSpan}>
        <Card title={'Login'}>
          <Form
            name="basic"
            initialValues={form}
            onFinish={handleSubmit}
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
