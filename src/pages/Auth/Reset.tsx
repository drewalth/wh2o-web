import React, { useEffect, useRef, useState } from 'react'

import Recaptcha from 'react-google-invisible-recaptcha'
import { Button, Card, Col, Form, Input, Row } from 'antd'
import { authColSpan } from './defaults'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authReset } from '../../controllers'
import { useTranslation } from 'react-i18next'
import { RequestStatus } from '../../types'

type ResetForm = { passwordConfirm: string; password: string }

const DEFAULT_FORM: ResetForm = {
  passwordConfirm: '',
  password: '',
}

export const Reset = () => {
  const { t } = useTranslation()
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY
  const recaptchaRef = useRef(null)
  const [form, setForm] = useState<ResetForm>(DEFAULT_FORM)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')
  const email = params.get('email')

  let redirectTimer

  const [humanDetected, setHumanDetected] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const inputsProvided =
    form.password.length >= 8 && form.passwordConfirm.length > 8

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
      if (!token || !email) return
      setRequestStatus('loading')
      await authReset({ ...form, token, email })

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
        <Card title={t('resetPassword')}>
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
              name="password"
              rules={[
                {
                  required: true,
                  message: t('invalidEmail'),
                },
              ]}
            >
              <Input placeholder={t('password')} type={'password'} />
            </Form.Item>

            <Form.Item
              name="passwordConfirm"
              rules={[
                { required: true, message: t('pleaseInputYourPassword') },
              ]}
            >
              <Input.Password
                placeholder={t('confirmPassword')}
                type={'password'}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!inputsProvided}
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
