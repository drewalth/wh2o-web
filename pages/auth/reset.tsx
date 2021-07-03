import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Button, Card, Col, Form, Input, Result, Row } from 'antd'
import {
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { resetPassword } from '../../controllers'
import { useRouter } from 'next/router'

interface ResetProps {
  id: number
  token: string
}

const Reset = (props: ResetProps) => {
  const { id, token } = props
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formValid, setFormValid] = useState(false)
  const router = useRouter()
  const [form, setForm] = useState<{
    new_password: string
    confirm_password: string
  }>({
    new_password: '',
    confirm_password: '',
  })

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      const result = await resetPassword({
        id,
        token,
        newPassword: values.confirm_password,
      })

      if (result === 'reset') {
        setSubmitted(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        await router.replace('/auth/login')
      }
    } catch (e) {
      console.log('e', e)
    } finally {
      setLoading(false)
    }
  }

  const testInput = (pass: string) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(pass)
  }

  useEffect(() => {
    if (!id || !token) {
      router.replace('/')
    }

    if (
      testInput(form.new_password) &&
      testInput(form.confirm_password) &&
      form.confirm_password === form.new_password
    ) {
      setFormValid(true)
    } else {
      setFormValid(false)
    }
  }, [form])

  return (
    <Row justify="center" style={{ paddingTop: 24 }}>
      <Col span={24} md={8}>
        <Card title="Reset Password">
          {!submitted && (
            <Form
              onValuesChange={(val) => setForm(Object.assign({}, form, val))}
              name="forgot"
              onFinish={onFinish}
            >
              <Form.Item
                name="new_password"
                help="8 characters, one number, one lowercase (a-z), one uppercase (A-Z)"
                rules={[
                  {
                    required: true,
                    message: 'Please input a valid password',
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                  },
                ]}
              >
                <Input.Password
                  prefix={<UserOutlined />}
                  placeholder="New Password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item
                name="confirm_password"
                rules={[
                  {
                    required: true,
                    message: 'Please confirm new password',
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                  },
                ]}
              >
                <Input.Password
                  prefix={<UserOutlined />}
                  placeholder="Confirm Password"
                  visibilityToggle={false}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  disabled={!formValid}
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}

          {submitted && !loading && (
            <Result
              status="success"
              title="Success"
              subTitle="Password successfully reset"
            />
          )}
        </Card>
      </Col>
    </Row>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      id: Number(context.query.id) || 0,
      token: context.query.token || '',
    },
  }
}

export default Reset
