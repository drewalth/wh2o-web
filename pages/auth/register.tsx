import { Form, Input, Button, Col, Row, Card } from "antd";
import { authRegister } from "controllers";
import { useRouter } from "next/router";
import { setUser, setUserLoading } from "store/slices/user.slice";
import { useAppDispatch } from "store";
import { useEffect } from "react";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Register = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch("https://extreme-ip-lookup.com/json/")
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        console.log("Country: ", response.country);
      })
      .catch((data, status) => {
        console.log("Request failed");
      });
  }, []);

  const onFinish = async (values: any) => {
    try {
      dispatch(setUserLoading(true));
      const result = await authRegister({
        ...values,
        verified: false,
        createdAt: new Date(),
      });

      if (result && result.id) {
        dispatch(setUser(result));
        dispatch(setUserLoading(false));
        await router.push(`/user/${result.id}`);
      }
      console.log(result);
    } catch (e) {
      console.log("e", e);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Row justify="center" gutter={24} style={{ paddingTop: 24 }}>
      <Col span={24} md={8}>
        <Card title="Register">
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="First Name" name="firstName">
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName">
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input a valid password",
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;
