import React, { useEffect, useRef, useState } from 'react'

import Recaptcha from 'react-google-invisible-recaptcha'
import { Button, Card, Col, Form, Input, Row, Typography } from 'antd'
import { authColSpan } from './defaults'
import { validateEmail } from '../../lib'
import { authForgot } from '../../controllers'
import { RequestStatus } from '../../types'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type ForgotForm = { email: string }

const DEFAULT_FORM: ForgotForm = {
  email: '',
}

export const Forgot = () => {
  const { t } = useTranslation()
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY
  const recaptchaRef = useRef(null)
  const [form, setForm] = useState<ForgotForm>(DEFAULT_FORM)
  // const { env } = useAppContext()

  const [humanDetected, setHumanDetected] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()

  const emailValid = validateEmail(form.email)

  const checkRecaptcha = () => {
    try {
      if (humanDetected) return

      if (!emailValid) {
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
      await authForgot(form.email)
      setRequestStatus('success')
    } catch (e) {
      console.error(e)
      setRequestStatus('failure')
    }
  }

  useEffect(() => {
    ;(async () => {
      if (formSubmitted && humanDetected) {
        await handleSubmit()
      }
    })()
  }, [formSubmitted, humanDetected])

  if (requestStatus === 'success') {
    return (
      <Row>
        <Col>Yay</Col>
      </Row>
    )
  }

  return (
    <Row justify={'center'}>
      <Col {...authColSpan}>
        <Card
          title={t('login.forgot')}
          actions={[
            <Link to={'/auth/register'}>
              <Typography.Link>{t('register.title')}</Typography.Link>
            </Link>,
            <Link to={'/auth/login'}>
              <Typography.Link>{t('usermenu.signin')}</Typography.Link>
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
            <Form.Item name="email">
              <Input placeholder={t('register.email')} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!emailValid}
                loading={requestStatus === 'loading'}
              >
                {t('common.submit')}
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
