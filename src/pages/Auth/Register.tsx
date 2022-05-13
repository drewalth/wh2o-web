import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
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
import { LegalModal } from '../Legal'
import { useTranslation } from 'react-i18next'

type RegisterForm = {
  name: string
  email: string
  telephone: string
  timezone: string
  password: string
  passwordConfirm: string
  termsAgreed: boolean
}

export const Register = () => {
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY
  const { reload } = useUserContext()
  const { t } = useTranslation()
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
  const [legalModalVisible, setLegalModalVisible] = useState(false)
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
    termsAgreed: false,
  })
  const DEFAULT_PASS_ERR_MSG = t('pleaseInputYourPassword')
  const [passwordErrMsg, setPasswordErrMsg] = useState(DEFAULT_PASS_ERR_MSG)

  const DEFAULT_PASS_CONFIRM_ERR_MSG = t('pleaseConfirmPassword')
  const [passwordConfirmErrMsg, setPasswordConfirmErrMsg] = useState(
    DEFAULT_PASS_CONFIRM_ERR_MSG,
  )

  const navigate = useNavigate()

  const passwordErrors: any[] | boolean = schema.validate(form.password, {
    list: true,
  })

  const formValid =
    form.termsAgreed &&
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
        message: t('entityCreateSuccess', { entity: t('account') }),
        placement: 'bottomRight',
      })
      await reload()
      navigate('/user/dashboard')
    } catch (e) {
      console.error(e)
      if (String(e).includes('Account with email')) {
        setDuplicateEmailProvided(true)
      } else {
        setRequestStatus('failure')
        notification.error({
          message: t('entityCreateError', { entity: t('account') }),
          placement: 'bottomRight',
        })
      }
      setSubmitted(false)
    }
  }

  const validatePasswordConfirm = (rule, value, callback) => {
    if (value && value !== form.password) {
      setPasswordConfirmErrMsg(t('passwordsDoNotMatch'))
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
        msg.push(t('mustContainOneNumber'))
      }

      if (passwordErrorsList.includes('min')) {
        msg.push(t('minimumEightCharacters'))
      }

      if (passwordErrorsList.includes('uppercase')) {
        msg.push(t('mustContainUppercase'))
      }

      if (passwordErrorsList.includes('lowercase')) {
        msg.push(t('mustContainLowercase'))
      }

      if (passwordErrorsList.includes('symbols')) {
        msg.push(t('mustContainSpecialCharacter'))
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
          title={t('register')}
          actions={[
            <Link to={'/auth/forgot'}>
              <Typography.Link>{t('forgotPassword')}</Typography.Link>
            </Link>,
            <Link to={'/auth/login'}>
              <Typography.Link>{t('signIn')}</Typography.Link>
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
              rules={[{ required: true, message: t('pleaseInputYourName') }]}
            >
              <Input placeholder={t('name')} />
            </Form.Item>
            <Form.Item
              name="email"
              help={duplicateEmailProvided ? t('accountExists') : ''}
              rules={[
                {
                  required: true,
                  message: t('invalidEmail'),
                  type: 'email',
                },
              ]}
            >
              <Input
                placeholder={t('email')}
                status={duplicateEmailProvided ? 'error' : ''}
              />
            </Form.Item>
            <Form.Item
              name={'telephone'}
              help={form.telephone.length > 0 ? t('telephoneHelpText') : ''}
            >
              <Space direction={'horizontal'}>
                <Input placeholder={t('telephone')} />
                <HelpTooltip title={t('telephoneTooltip')} />
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
              <Input.Password placeholder={t('password')} />
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
              <Input.Password placeholder={t('confirmPassword')} />
            </Form.Item>
            <Form.Item
              name={'termsAgreed'}
              valuePropName="checked"
              required={true}
            >
              <Checkbox>
                <Typography.Link
                  onClick={(e) => {
                    e.preventDefault()
                    setLegalModalVisible(true)
                  }}
                >
                  {' '}
                  {t('termsAndConditions')}
                </Typography.Link>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!formValid}
                loading={requestStatus === 'loading'}
              >
                {t('submit')}
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
      <LegalModal
        visible={legalModalVisible}
        onOk={() => {
          setLegalModalVisible(false)
        }}
        onCancel={() => {
          setLegalModalVisible(false)
        }}
      />
    </Row>
  )
}
