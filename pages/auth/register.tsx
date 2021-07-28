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
import { createRef, useEffect, useState } from 'react'
import { CreateUserDto, Timezone } from '../../interfaces'
import { getTimezones } from '../../controllers/timezones'
import ReCAPTCHA from 'react-google-recaptcha'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

interface RegisterProps {
  reCaptchaSiteKey: string
}

const Register = (props: RegisterProps) => {
  const { reCaptchaSiteKey } = props
  const [options, setOptions] = useState<{ value: string }[]>([])
  const [timezones, setTimezones] = useState<Timezone[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form, setForm] = useState<CreateUserDto>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    timezone: '',
  })
  const router = useRouter()
  const dispatch = useAppDispatch()
  const recaptchaRef = createRef<ReCAPTCHA>()

  const loadTimezones = async () => {
    try {
      const results = await getTimezones()
      setTimezones(results)
    } catch (e) {
      console.log('e', e)
      message.error('Timezones failed to load')
    }
  }

  const validate = async () => {
    return fetch('/api/validate-recaptcha', {
      method: 'POST',
    })
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
        setSubmitLoading(false)
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
    console.log(props)
  }, [])

  const handleSubmit = (event: any) => {
    // Execute the reCAPTCHA when the form is submitted
    recaptchaRef?.current?.execute()
  }

  const onReCAPTCHAChange = async (captchaCode: any) => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if (!captchaCode) {
      return
    }
    try {
      setSubmitLoading(true)

      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ form, captcha: captchaCode }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        // If the response is ok than show the success alert
        await onFinish(form)
      } else {
        // Else throw an error with the message returned
        // from the API
        const error = await response.json()
        throw new Error(error.message)
      }
    } catch (error) {
      console.log(error)
      alert(error?.message || 'Something went wrong')
    } finally {
      // Reset the reCAPTCHA when the request has failed or succeeeded
      // so that it can be executed again if user submits another email.
      recaptchaRef?.current?.reset()
    }
  }

  return (
    <Row justify="center" gutter={24} style={{ paddingTop: 24 }}>
      <Col span={24} md={8}>
        <Card title="Register">
          <Form
            {...layout}
            name="basic"
            layout={'vertical'}
            initialValues={{ remember: true }}
            onValuesChange={(evt) => setForm(Object.assign({}, form, evt))}
            onFinish={handleSubmit}
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
              style={{ marginBottom: 16 }}
              name="telephone"
              label="Telephone"
              help={'Required for SMS alerts.'}
            >
              <Input />
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
            <Form.Item hidden={!reCaptchaSiteKey}>
              <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={reCaptchaSiteKey}
                onChange={onReCAPTCHAChange}
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!canSave}
                loading={submitLoading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
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
      reCaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
    },
  }
}

export default Register
