import React, { useEffect, useRef, useState } from 'react'

import Recaptcha from 'react-google-invisible-recaptcha'
import { Button, Card, Col, Form, Input, notification, Row, Select } from 'antd'
import { authColSpan } from './Auth/defaults'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../components/User/UserContext'
import {
  ContactType,
  Country,
  CreateContactDto,
  GageSource,
  RequestStatus,
} from '../types'
import { createContactSubmission } from '../controllers/contact'
import { getCountryStates, usStates } from '../lib'

const DEFAULT_FORM: CreateContactDto = {
  description: '',
  email: '',
  type: ContactType.FEATURE_REQUEST,
  title: '',
  country: Country.US,
  source: GageSource.USGS,
  state: usStates[0].abbreviation,
}

export const Contact = () => {
  const recaptchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY
  const recaptchaRef = useRef(null)
  const [form, setForm] = useState<CreateContactDto>(DEFAULT_FORM)
  const { user } = useUserContext()
  const navigate = useNavigate()

  const [requestStatus, setRequestStatus] = useState<RequestStatus>()
  const [humanDetected, setHumanDetected] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const inputsProvided = form.title.length >= 1

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
      await createContactSubmission({
        ...form,
        userId: user ? user.id : 0,
      })
      setRequestStatus('success')
      notification.success({
        message: 'Submission created',
        placement: 'bottomRight',
      })
      await new Promise((resolve) => setTimeout(resolve, 500))
      navigate('/')
    } catch (e) {
      console.error(e)
      notification.error({
        message: 'Failed to submit',
        placement: 'bottomRight',
      })
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

  return (
    <Row justify={'center'}>
      <Col {...authColSpan}>
        <Card title={'Contact'}>
          <Form
            preserve={false}
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
                  message: 'Please your email',
                  type: 'email',
                },
              ]}
            >
              <Input placeholder={'Email'} />
            </Form.Item>
            <Form.Item name={'type'}>
              <Select>
                {Object.values(ContactType).map((t) => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please include title',
                },
              ]}
            >
              <Input placeholder={'Title'} />
            </Form.Item>
            <Form.Item
              name="description"
              hidden={form.type === ContactType.MISSING_GAGE}
              rules={[
                {
                  required: form.type !== ContactType.MISSING_GAGE,
                  message: 'Please provide description',
                },
              ]}
            >
              <Input.TextArea
                placeholder={'Description'}
                showCount
                style={{ height: 150 }}
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              hidden={form.type !== ContactType.MISSING_GAGE}
              name="siteId"
              rules={[
                {
                  required: form.type === ContactType.MISSING_GAGE,
                  message: 'Please provide gage site ID',
                },
              ]}
            >
              <Input placeholder={'Station ID'} />
            </Form.Item>
            <Form.Item
              name={'country'}
              hidden={form.type !== ContactType.MISSING_GAGE}
            >
              <Select>
                {Object.values(Country).map((c) => (
                  <Select.Option key={c} value={c}>
                    {c}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={'state'}
              hidden={form.type !== ContactType.MISSING_GAGE}
            >
              <Select>
                {getCountryStates(form.country).map((s) => (
                  <Select.Option key={s.abbreviation} value={s.abbreviation}>
                    {s.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={'source'}
              hidden={form.type !== ContactType.MISSING_GAGE}
            >
              <Select>
                {Object.values(GageSource).map((s) => (
                  <Select.Option key={s} value={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={requestStatus === 'loading'}
                disabled={!inputsProvided}
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
