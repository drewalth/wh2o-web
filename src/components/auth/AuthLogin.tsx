import React, {useState} from 'react';
import {useMutation} from '@apollo/client';
import {Button, Form, Input} from 'antd';
import {LOGIN} from './mutations';
// import { useHistory } from 'react-router-dom';
import {AuthLoginInput, AuthLoginResponse} from '../../types';
import {setAuthToken} from './token';
import {useUserContext} from '../user/userContext';
import {navigate} from "gatsby";

export const AuthLogin = () => {
    // const history = useHistory();
    const user = useUserContext();
    const [form, setForm] = useState<AuthLoginInput>({password: '', email: ''});
    const [handleLogin, {data, error, loading}] = useMutation<{ login: AuthLoginResponse },
        { authLoginInput: AuthLoginInput }>(LOGIN, {
        variables: {
            authLoginInput: form
        }
    });

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="basic"
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            initialValues={form}
            onFinish={async () => {
                await handleLogin({
                    variables: {
                        authLoginInput: form
                    }
                }).then(async ({data}) => {
                    setAuthToken(data?.login.token || '');
                    await user.decodeJwt();
                    await user.loadUser();
                    // history.replace('/user');
                    await navigate('/user')
                });
            }}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            onValuesChange={(val) => setForm(Object.assign({}, form, val))}
        >
            <Form.Item label="Email" name="email" rules={[{required: true, message: 'Please input your email!'}]}>
                <Input/>
            </Form.Item>

            <Form.Item label="Password" name="password"
                       rules={[{required: true, message: 'Please input your password!'}]}>
                <Input.Password/>
            </Form.Item>

            {/*<Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>*/}
            {/*  <Checkbox>Remember me</Checkbox>*/}
            {/*</Form.Item>*/}

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};
