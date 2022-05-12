import React, { useEffect, useRef, useState } from 'react'

import Recaptcha from 'react-google-invisible-recaptcha'
import { Button, Card, Col, Form, Input, Row, Typography } from 'antd'
import { authColSpan } from './defaults'
import { Link, useNavigate } from 'react-router-dom'
import { authLogin } from '../../controllers'
import { setToken } from '../../lib/token'
import { useUserContext } from '../../components/User/UserContext'
import { useTranslation } from 'react-i18next'
import { RequestStatus } from '../../types'
import { useAnalytics } from '../../hooks/useAnalytics'

type LoginForm = { email: string; password: string }

const DEFAULT_FORM: LoginForm = {
  email: '',
  password: '',
}

export const Login = () => {
  useAnalytics()
  const { t } = useTranslation()
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY
  const recaptchaRef = useRef(null)
  const [form, setForm] = useState<LoginForm>(DEFAULT_FORM)
  const { reload } = useUserContext()
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()
  const navigate = useNavigate()
  let redirectTimer

  const [humanDetected, setHumanDetected] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const inputsProvided = form.password.length >= 8 && form.email.length > 3

  const checkRecaptcha = () => {
    try {
      if (humanDetected) return

      if (!inputsProvided) {
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
      const { token } = await authLogin(form)
      setToken(token)
      await reload()

      await new Promise((resolve) => {
        redirectTimer = setTimeout(resolve, 500)
      }).catch((e) => {
        console.error(e)
      })
      navigate('/user/dashboard')
    } catch (e) {
      setRequestStatus('failure')
      console.error(e)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (formSubmitted && humanDetected) {
        await handleSubmit()
      }
    })()
    return () => {
      clearTimeout(redirectTimer)
    }
  }, [formSubmitted, humanDetected])

  return (
    <Row justify={'center'}>
      <Col {...authColSpan}>
        <Card
          title={t('signIn')}
          actions={[
            <Link to={'/auth/register'}>
              <Typography.Link>{t('register')}</Typography.Link>
            </Link>,
            <Link to={'/auth/forgot'}>
              <Typography.Link>{t('forgotPassword')}</Typography.Link>
            </Link>,
          ]}
        >
          <Form
            name="basic"
            initialValues={form}
            onFinish={() => {
              checkRecaptcha()
              setFormSubmitted(true)
            }}
            autoComplete="off"
            onValuesChange={(val) => setForm(Object.assign({}, form, val))}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: t('invalidEmail'),
                  type: 'email',
                },
              ]}
            >
              <Input placeholder={t('email')} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: t('pleaseInputYourPassword') },
              ]}
            >
              <Input.Password placeholder={t('password')} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
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
    </Row>
  )
}
