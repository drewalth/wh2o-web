import React, {useState} from 'react'
import {Button, Card, Col, Form, Input, Row} from "antd";
import {authColSpan} from "../../components/auth/defaults";
import {useMutation} from "@apollo/client";
import {FORGOT_PASSWORD} from "../../components/auth/mutations";
import {validateEmail} from "../../helpers/validateEmail";

const Forgot = () => {
    const [email, setEmail] = useState('')
    const [handleSubmit, {loading}] = useMutation(FORGOT_PASSWORD, {
        onCompleted: data => {
            console.log('data', data)
        }
    })

    const emailValid = validateEmail(email) !== null

    return (
        <Row justify={'center'}>
            <Col {...authColSpan}>
                <Card title={"Forgot Password"}>
                    <Form initialValues={{email: ''}} onValuesChange={({email}) => {
                        setEmail(email)
                    }} onFinish={async () => {
                        await handleSubmit({
                            variables: {
                                email
                            }
                        })
                    }}>
                        <Form.Item name={"email"} rules={[
                            {
                                required: true,
                                message: 'Please submit your email address'
                            },
                        ]}>
                            <Input placeholder={'Email'}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} disabled={!emailValid}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default Forgot
