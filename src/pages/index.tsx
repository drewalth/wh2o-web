import * as React from 'react'
import { Alert, Button, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd'
import { AreaChartOutlined, GithubOutlined, QuestionCircleOutlined, ReadOutlined } from '@ant-design/icons'

import { StaticImage } from 'gatsby-plugin-image'
import { navigate } from 'gatsby'

const IndexPage = () => {
  return (
    <>
      <StaticImage
        placeholder="blurred"
        src={'../images/j-huis-cover.jpg'}
        alt={'John Huisjen'}
        style={{
          position: 'absolute',
          top: 0,
          left: -32,
          height: '100vh',
          objectFit: 'cover',
          zIndex: 1
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, paddingTop: 64 }}>
        <Row justify={'center'} className={'full-height-row'} align={'top'}>
          <Col span={24} sm={12} md={12} lg={12} xl={8}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography.Title level={1} style={{ lineHeight: 1 }}>
                  wh2o
                </Typography.Title>
                <div>
                  <Tag color={'blue'}>Alpha</Tag>
                </div>
              </div>
              <Typography.Title level={5}>Email & SMS Notifications for USGS River Gages</Typography.Title>
              <Divider />
              <Space size={'large'} direction={'vertical'}>
                <Alert
                  description="This app is a work-in-progress. There will be bugs and UI design issues."
                  type="info"
                />
                <Space direction={'horizontal'}>
                  <Button icon={<AreaChartOutlined />} onClick={() => navigate('/gages')}>
                    Gages
                  </Button>
                  <Button icon={<QuestionCircleOutlined />} onClick={() => navigate('/questions')}>
                    FAQ
                  </Button>
                  <Button icon={<ReadOutlined />} onClick={() => navigate('/about')}>
                    About
                  </Button>
                  <Button
                    onClick={() => window.open('https://github.com/drewalth/wh2o-docker', '_blank')}
                    icon={<GithubOutlined />}
                  >
                    GitHub
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default IndexPage
