import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Card, Checkbox, Col, Form, Input, message, Row } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { authLogin } from '../../controllers'
import { useAppDispatch } from '../../store'
import { setUser, setUserLoading } from '../../store/slices/user.slice'

const Login = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const onFinish = async (values: any) => {
    try {
      dispatch(setUserLoading(true))
      const result = await authLogin(values)

      if (result?.access_token) {
        localStorage.setItem('wh2o-auth-token', result.access_token)
        dispatch(setUser(result.user))
        dispatch(setUserLoading(false))
        await router.push(`/user/${result.user.id}`)
      }
    } catch (e) {
      console.log('e', e)
      message.error('Login failed...')
    } finally {
      dispatch(setUserLoading(false))
    }
  }

  return (
    <Row justify="center" style={{ paddingTop: 24 }}>
      <Col span={24} md={8}>
        <Card title="Login">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
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
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Link href="/auth/forgot">
                <a style={{ float: 'right' }} href="">
                  Forgot password
                </a>
              </Link>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" block>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <div style={{ marginTop: 24, width: '100%', textAlign: 'center' }}>
          <Link href="/auth/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </Col>
    </Row>
  )
}

export default Login
