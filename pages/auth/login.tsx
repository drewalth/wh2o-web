import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Card, Col, Form, Input, Row } from 'antd'
import { authLogin } from '../../controllers'
import { useAppDispatch } from '../../store'
import { setUser, setUserLoading } from '../../store/slices/user.slice'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

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
    } finally {
      dispatch(setUserLoading(false))
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Row justify="center" style={{ paddingTop: 24 }}>
      <Col span={24} md={8}>
        <Card title="Login">
          <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Button>
          <Link href="/auth/register">Register</Link>
        </Button>
      </Col>
    </Row>
  )
}

export default Login
