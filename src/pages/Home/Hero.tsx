import React from 'react'
import { Button, Card, Col, Popover, Row, Tag, Typography } from 'antd'
import cover from '../../assets/john-huisjen-cover.jpeg'
import { CameraOutlined } from '@ant-design/icons'

export const Hero = () => {
  return (
    <div
      className={'hero-container'}
      style={{ backgroundImage: `url(${cover})` }}
    >
      <Row justify={'center'} align={'middle'} style={{ height: '60%' }}>
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
            <Typography.Title level={5}>
              Custom Reporting & Flow Predictions for Rivers in the United
              States and Canada
            </Typography.Title>
          </Card>
        </Col>
      </Row>
      <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Popover
          placement={'topLeft'}
          content={
            <div>
              <Typography.Title
                level={5}
                style={{ lineHeight: 1, margin: 0, padding: 0 }}
              >
                John Huisjen
              </Typography.Title>
              <Typography.Text>W. Branch Penobscot, ME, USA</Typography.Text>
            </div>
          }
        >
          <Button size={'middle'} shape={'circle'}>
            <CameraOutlined />
          </Button>
        </Popover>
      </div>
    </div>
  )
}
