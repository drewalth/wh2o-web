import {
  Form,
  Input,
  Button,
  Col,
  Row,
  Card,
  message,
  AutoComplete,
} from 'antd'
import { authRegister } from 'controllers'
import { useRouter } from 'next/router'
import { setUser, setUserLoading } from 'store/slices/user.slice'
import { useAppDispatch } from 'store'
import { useEffect, useState } from 'react'
import { CreateUserDto, Timezone } from '../../interfaces'
import { getTimezones } from '../../controllers/timezones'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const Register = () => {
  const [options, setOptions] = useState<{ value: string }[]>([])
  const [timezones, setTimezones] = useState<Timezone[]>([])
  const [form, setForm] = useState<CreateUserDto>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    timezone: '',
  })
  const router = useRouter()
  const dispatch = useAppDispatch()

  const loadTimezones = async () => {
    try {
      const results = await getTimezones()
      setTimezones(results)
    } catch (e) {
      console.log('e', e)
      message.error('Timezones failed to load')
    }
  }

  const onFinish = async (values: any) => {
    try {
      if (!timezones.map((tz) => tz.tzCode).includes(values.timezone)) {
        message.error('Invalid Timezone')

        return
      }

      dispatch(setUserLoading(true))
      const result = await authRegister({
        ...values,
        verified: false,
        createdAt: new Date(),
      })

      if (result && result.id) {
        dispatch(setUser(result))
        dispatch(setUserLoading(false))
        await router.push(`/user/${result.id}`)
      }
      console.log(result)
    } catch (e) {
      console.log('e', e)
    }
  }

  const canSave =
    Object.values(form).every((val) => val.length > 1) &&
    timezones.map((tz) => tz.tzCode).includes(form.timezone)

  const onSearch = (searchText: string) => {
    setOptions(
      !searchText
        ? timezones.map((tz) => ({ value: tz.tzCode }))
        : timezones
            .filter((tz) =>
              tz.tzCode.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((el) => ({ value: el.tzCode }))
    )
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    loadTimezones()
  }, [])

  return (
    <Row justify="center" gutter={24} style={{ paddingTop: 24 }}>
      <Col span={24} md={8}>
        <Card title="Register">
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onValuesChange={(evt) => setForm(Object.assign({}, form, evt))}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="First Name" name="firstName" required>
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" required>
              <Input />
            </Form.Item>
            <Form.Item name="timezone" label="Timezone" required>
              <AutoComplete
                options={options}
                style={{ width: 200 }}
                onSearch={onSearch}
                placeholder="America/Denver"
              />
            </Form.Item>
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
                {
                  required: true,
                  message: 'Please input a valid password',
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" disabled={!canSave}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default Register
