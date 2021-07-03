import { Button, Card, Col, Form, Input, message, Result, Row } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { forgotPassword } from '../../controllers'
import { useState } from 'react'

const Forgot = () => {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      const result = await forgotPassword(values)

      if (result === 'invalid') {
        setError(true)
        message.error('No account found')
      } else {
        setSubmitted(true)
      }
    } catch (e) {
      console.log('e', e)
      message.error('something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row justify="center" style={{ paddingTop: 24 }}>
      <Col span={24} md={8}>
        <Card title="Forgot Password">
          {!submitted && (
            <Form
              onValuesChange={() => setError(false)}
              name="forgot"
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input a valid email',
                    pattern: /(.+)@(.+){2,}\.(.+){2,}/,
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
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
              subTitle="A reset link has been sent to the provided email"
            />
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default Forgot
