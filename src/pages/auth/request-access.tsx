import React, {useState} from 'react'
import {Alert, Button, Card, Col, Form, Input, Row} from "antd";
import {authColSpan} from "../../components/auth/defaults";
import {useMutation} from "@apollo/client";
import {REQUEST_ACCESS} from "../../components/auth/mutations";
import {validateEmail} from "../../helpers/validateEmail";

const RequestAccess = () => {
    const [email, setEmail] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [showError, setShowError] = useState(false)
    const [showForm, setShowForm] = useState(true)
    const [handleReq, {loading}] = useMutation(REQUEST_ACCESS, {
        onCompleted: ({requestAccess}) => {
            if (requestAccess === "User already exists") {
                setShowError(true)
            } else if (requestAccess === 'Request submitted.') {
                setShowResult(true)
                setShowForm(false)
            }
        }
    })
    const emailValid = validateEmail(email) !== null

    return (
        <Row justify={'center'}>
            <Col {...authColSpan}>
                <Card title={"Request Access"}>
                    {showForm && (
                        <Form initialValues={{email: ''}} onValuesChange={({email}) => {
                            setShowResult(false)
                            setShowError(false)
                            setEmail(email)
                        }}
                              onFinish={async () => {
                                  await handleReq({
                                      variables: {
                                          email
                                      }
                                  })
                              }}>
                            <Form.Item name={'email'}>
                                <Input placeholder={"Email"}/>
                            </Form.Item>
                            <Form.Item>
                                <Button type={'primary'} htmlType={"submit"} disabled={!email || !emailValid}
                                        loading={loading}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                    {showResult && (
                        <Alert
                            description="Your request has been submitted. Expect a response within 1-3 day(s). Thanks!"
                            type="info"
                        />
                    )}
                    {showError && (
                        <Alert
                            description={"Someone is already using this email or you have a pending Access Request."}
                            type={"error"}
                        />
                    )}
                </Card>
            </Col>
        </Row>
    )
}

export default RequestAccess
