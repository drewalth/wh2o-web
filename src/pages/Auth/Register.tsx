import React, { useState } from 'react'
import { Button, Card, Col, Form, Input, Row } from 'antd'
import { authColSpan } from './defaults'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../../controllers'
import { validateEmail } from '../../lib'

type RegisterForm = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const navigate = useNavigate()
  const handleSubmit = async () => {
    try {
      const result = await createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        telephone: '',
        timezone: 'America/Denver',
      })

      console.log(result)

      navigate('/auth/login')
    } catch (e) {
      console.error(e)
    }
  }

  const formValid =
    form.password === form.passwordConfirm &&
    validateEmail(form.email) &&
    form.password.length > 0

  return (
    <Row justify={'center'}>
      <Col {...authColSpan}>
        <Card title={'Register'}>
          <Form
            name="basic"
            initialValues={form}
            onFinish={handleSubmit}
            autoComplete="off"
            onValuesChange={(val) => setForm(Object.assign({}, form, val))}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder={'Name'} />
            </Form.Item>
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
            <Form.Item
              name="passwordConfirm"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder={'Confirm Password'} />
            </Form.Item>

            {/*<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>*/}
            {/*  <Checkbox>Remember me</Checkbox>*/}
            {/*</Form.Item>*/}

            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={!formValid}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}
