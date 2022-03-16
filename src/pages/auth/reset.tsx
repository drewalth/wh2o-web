import React, { useState } from 'react'
import { authColSpan } from '../../components/auth/defaults'
import { Button, Card, Col, Form, Input, Row } from 'antd'
import { useMutation } from '@apollo/client'
import { RESET_PASSWORD } from '../../components/auth/mutations'
import { ResetUserPasswordInput } from '../../types'
import { navigate } from 'gatsby'

const Reset = ({ location }: { location: { search: string } }) => {
  const [handleReset, { loading }] = useMutation<
    { resetUserPassword: 'reset' | 'invalid' },
    { resetUserPasswordInput: ResetUserPasswordInput }
  >(RESET_PASSWORD, {
    onCompleted: ({ resetUserPassword }) => {
      if (resetUserPassword === 'reset') {
        navigate('/auth/login')
      }
    }
  })
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  // https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
  const validateInputs = (): boolean => {
    return password.length > 8 && confirmPass === password
  }

  const getInputs = (field: 'user_id' | 'token') => {
    const params1 = new URLSearchParams(location.search)
    for (const [key, value] of params1.entries()) {
      if (key === field) return value
    }
    return ''
  }

  const inputsInvalid = !validateInputs()

  const handleSubmit = async () => {
    await handleReset({
      variables: {
        resetUserPasswordInput: {
          password,
          id: Number(getInputs('user_id')),
          token: getInputs('token')
        }
      }
    })
  }

  return (
    <Row justify={'center'}>
      <Col {...authColSpan}>
        <Card title={'Reset Password'}>
          <Form
            onValuesChange={(val) => {
              if (val.password) {
                setPassword(val.password)
              } else {
                setConfirmPass(val.confirmPass)
              }
            }}
            onFinish={handleSubmit}
          >
            <Form.Item name={'password'}>
              <Input.Password placeholder={'New password'} />
            </Form.Item>
            <Form.Item name={'confirmPass'}>
              <Input.Password placeholder={'Confirm new password'} />
            </Form.Item>
            <Form.Item>
              <Button disabled={inputsInvalid} type={'primary'} htmlType={'submit'} loading={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default Reset
