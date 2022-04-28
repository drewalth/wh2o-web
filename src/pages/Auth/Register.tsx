import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Typography,
} from 'antd'
import { authColSpan } from './defaults'
import { Link, useNavigate } from 'react-router-dom'
import { createUser } from '../../controllers'
import { timezones, validateEmail } from '../../lib'
import PasswordValidator from 'password-validator'
import { HelpTooltip } from '../../components/Common'
import { useCurrentTimezone } from '../../hooks'
import { setToken } from '../../lib/token'
import { useUserContext } from '../../components/User/UserContext'
import { RequestStatus } from '../../types'
import Recaptcha from 'react-google-invisible-recaptcha'

type RegisterForm = {
  name: string
  email: string
  telephone: string
  timezone: string
  password: string
  passwordConfirm: string
}

export const Register = () => {
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY
  const { reload } = useUserContext()
  const schema = new PasswordValidator()
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(1) // Must have at least 2 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .has()
    .symbols()
    .is()
    .not()
    .oneOf(['Passw0rd', 'Password123']) // Blacklist these values

  const recaptchaRef = useRef(null)
  const timezone = useCurrentTimezone()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()
  const [humanDetected, setHumanDetected] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [duplicateEmailProvided, setDuplicateEmailProvided] = useState(false)
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    timezone,
    telephone: '',
  })
  const DEFAULT_PASS_ERR_MSG = 'Please input your password!'
  const [passwordErrMsg, setPasswordErrMsg] = useState(DEFAULT_PASS_ERR_MSG)

  const DEFAULT_PASS_CONFIRM_ERR_MSG = 'Please confirm password'
  const [passwordConfirmErrMsg, setPasswordConfirmErrMsg] = useState(
    DEFAULT_PASS_CONFIRM_ERR_MSG,
  )

  const navigate = useNavigate()

  const passwordErrors: any[] | boolean = schema.validate(form.password, {
    list: true,
  })

  const formValid =
    form.password === form.passwordConfirm &&
    validateEmail(form.email) &&
    Array.isArray(passwordErrors) &&
    passwordErrors.length === 0

  const checkRecaptcha = () => {
    try {
      if (humanDetected) return
      if (!formValid) {
        // @ts-ignore
        recaptchaRef.current.reset()
      } else {
        // @ts-ignore
        recaptchaRef.current.execute()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async () => {
    try {
      setRequestStatus('loading')
      const { token } = await createUser(form)
      setToken(token)
      await new Promise((resolve) => setTimeout(resolve, 1000)).catch((e) => {
        console.error(e)
      })
      setRequestStatus('success')
      notification.success({
        message: 'Account created',
        placement: 'bottomRight',
      })
      await reload()
      navigate('/user/explore')
    } catch (e) {
      console.error(e)
      if (String(e).includes('Account with email')) {
        setDuplicateEmailProvided(true)
      } else {
        setRequestStatus('failure')
        notification.error({
          message: 'Failed to create account',
          placement: 'bottomRight',
        })
      }
      setSubmitted(false)
    }
  }

  const validatePasswordConfirm = (rule, value, callback) => {
    if (value && value !== form.password) {
      setPasswordConfirmErrMsg('Passwords do not match')
      callback('Error!')
    } else {
      callback()
    }
  }

  const validatePassword = (rule, value, callback) => {
    const passwordErrorsList = schema.validate(form.password, {
      list: true,
    })

    if (
      value &&
      Array.isArray(passwordErrorsList) &&
      passwordErrorsList.length > 0
    ) {
      const msg: string[] = []

      if (passwordErrorsList.includes('digits')) {
        msg.push('Must include one number')
      }

      if (passwordErrorsList.includes('min')) {
        msg.push('Minimum 8 characters')
      }

      if (passwordErrorsList.includes('uppercase')) {
        msg.push('Must contain uppercase')
      }

      if (passwordErrorsList.includes('lowercase')) {
        msg.push('Must contain lowercase')
      }

      if (passwordErrorsList.includes('symbols')) {
        msg.push('Must contain special character')
      }

      const val = msg.join(', ')

      setPasswordErrMsg(val)

      callback('Error!')
    } else {
      callback()
    }
  }

  useEffect(() => {
    ;(async () => {
      if (submitted && humanDetected) {
        await handleSubmit()
      }
    })()
  }, [submitted, humanDetected])

  return (
    <Row justify={'center'}>
      <Col {...authColSpan}>
        <Card
          title={'Register'}
          actions={[
            <Link to={'/auth/forgot'}>
              <Typography.Link>Forgot Password</Typography.Link>
            </Link>,
            <Link to={'/auth/login'}>
              <Typography.Link>Login</Typography.Link>
            </Link>,
          ]}
        >
          <Form
            name="basic"
            initialValues={form}
            onFinish={() => {
              checkRecaptcha()
              setSubmitted(true)
            }}
            autoComplete="off"
            onValuesChange={(val) => {
              setDuplicateEmailProvided(false)
              setForm(Object.assign({}, form, val))
            }}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name' }]}
            >
              <Input placeholder={'Name'} />
            </Form.Item>
            <Form.Item
              name="email"
              help={
                duplicateEmailProvided
                  ? 'Account with provided email already exists.'
                  : ''
              }
              rules={[
                {
                  required: true,
                  message: 'Invalid email',
                  type: 'email',
                },
              ]}
            >
              <Input
                placeholder={'Email'}
                status={duplicateEmailProvided ? 'error' : ''}
              />
            </Form.Item>
            <Form.Item
              name={'telephone'}
              help={
                form.telephone.length > 0
                  ? "Please include country code. I.e. '+1'"
                  : ''
              }
            >
              <Space direction={'horizontal'}>
                <Input placeholder={'Telephone'} />
                <HelpTooltip
                  title={'Optional. Used for SMS alerts that you create.'}
                />
              </Space>
            </Form.Item>
            <Form.Item name={'timezone'}>
              <Select>
                {timezones.map((tz) => (
                  <Select.Option key={tz} value={tz}>
                    {tz}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: passwordErrMsg,
                  validator: validatePassword,
                },
              ]}
            >
              <Input.Password placeholder={'Password'} />
            </Form.Item>
            <Form.Item
              name="passwordConfirm"
              rules={[
                {
                  required: true,
                  message: passwordConfirmErrMsg,
                  validator: validatePasswordConfirm,
                },
              ]}
            >
              <Input.Password placeholder={'Confirm Password'} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!formValid}
                loading={requestStatus === 'loading'}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Recaptcha
        ref={recaptchaRef}
        sitekey={recaptchaSiteKey}
        onResolved={() => {
          setHumanDetected(true)
        }}
      />
    </Row>
  )
}
