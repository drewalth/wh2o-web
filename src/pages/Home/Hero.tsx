import React from 'react'
import { Card, Col, Row, Tag, Typography } from 'antd'
import cover from '../../assets/john-huisjen-cover.jpeg'

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
              Email & SMS Notifications for River Flow Data in the United States
              and Canada
            </Typography.Title>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
