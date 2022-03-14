import * as React from "react"
import {Alert, Button, Card, Col, Divider, Row, Space, Tag, Typography} from "antd";
import {GithubOutlined, ReadOutlined} from "@ant-design/icons"
import {navigate} from "gatsby";
// markup
const IndexPage = () => {

    return (
        <div style={{backgroundImage: 'url(./images/huisjen.jpg)'}}>
            <Row justify={'center'}>
                <Col span={24} sm={12} md={12} lg={12} xl={8}>
                    <Card>

                        <div style={{display: 'flex', alignItems: 'flex-start'}}><Typography.Title
                            level={1} style={{lineHeight: 1}}>wh2o</Typography.Title>
                            <div><Tag color={'blue'}>Alpha</Tag></div>
                        </div>
                        <Typography.Title level={5}>Email & SMS Notifications for USGS River
                            Gages</Typography.Title>
                        <Divider/>
                        <Space size={'large'} direction={'vertical'}>
                            <Alert
                                description="This app is a work-in-progress. There will be bugs and UI design issues."
                                type="info"
                            />
                            <Space>
                                <Button onClick={() => window.open('https://github.com/drewalth/wh2o-docker', '_blank')}
                                        icon={<GithubOutlined/>}>GitHub</Button>
                                <Button onClick={() => navigate('/about')} icon={<ReadOutlined/>}>Learn More</Button>
                            </Space>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default IndexPage
