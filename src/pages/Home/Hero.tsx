import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import cover from '../../assets/john-huisjen-cover.jpeg'

const GitHubButton = () => (
  <Button
    type={'text'}
    onClick={() =>
      window.open('https://github.com/drewalth/wh2o-docker', '_blank')
    }
    icon={<GithubOutlined />}
  >
    GitHub
  </Button>
)

const LoginButton = () => {
  let navigate = useNavigate()
  return (
    <Button
      type={'text'}
      onClick={() => navigate('/auth/login')}
      icon={<GithubOutlined />}
    >
      Login
    </Button>
  )
}

export const Hero = () => {
  return (
    <div
      className={'hero-container'}
      style={{ backgroundImage: `url(${cover})` }}
    >
      <Row justify={'center'} align={'middle'} style={{ height: '60%' }}>
        <Col span={24} sm={12} md={12} lg={12} xl={8}>
          <Card actions={[<LoginButton />, <GitHubButton />]}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography.Title level={1} style={{ lineHeight: 1 }}>
                wh2o
              </Typography.Title>
              <div>
                <Tag color={'blue'}>Alpha</Tag>
              </div>
            </div>
            <Typography.Title level={5}>
              Email & SMS Notifications for USGS River Gages
            </Typography.Title>
            <Divider />
            <Space size={'large'} direction={'vertical'}>
              <Space>
                <Row gutter={16}>
                  <Col>Gages</Col>
                  <Col>Gages</Col>
                </Row>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
