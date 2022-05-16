import { Hero } from './Hero'
import './Home.scss'
import { Button, Col, Row, Typography } from 'antd'
import {
  AreaChartOutlined,
  EyeOutlined,
  NotificationOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React from 'react'

const colProps = {
  span: 24,
  sm: 20,
  md: 18,
  lg: 10,
  xl: 5,
}

const Home = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      <Hero />
      <Row className={'feature-row'} justify={'center'}>
        <Col {...colProps} className={'feature-col'}>
          <AreaChartOutlined style={{ fontSize: 48, marginBottom: 8 }} />
          <Typography.Title level={2}>{t('hero.colOneTitle')}</Typography.Title>
          <Typography.Paragraph style={{ fontSize: '1.125rem' }}>
            {t('hero.colOneText')}
          </Typography.Paragraph>
          <Button onClick={() => navigate('/gage')} type={'ghost'}>
            {t('hero.colOneAction')}
          </Button>
        </Col>
        <Col {...colProps} className={'feature-col'}>
          <EyeOutlined style={{ fontSize: 48, marginBottom: 8 }} />
          <Typography.Title level={2}>{t('hero.colTwoTitle')}</Typography.Title>
          <Typography.Paragraph style={{ fontSize: '1.125rem' }}>
            {t('hero.colTwoText')}
          </Typography.Paragraph>
          <Button onClick={() => navigate('/prophet')} type={'ghost'}>
            {t('hero.colTwoAction')}
          </Button>
        </Col>
        <Col {...colProps} className={'feature-col'}>
          <NotificationOutlined style={{ fontSize: 48, marginBottom: 8 }} />
          <Typography.Title level={2}>
            {t('hero.colThreeTitle')}
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: '1.125rem' }}>
            {t('hero.colThreeText')}
          </Typography.Paragraph>
          <Button onClick={() => navigate('/auth/login')} type={'ghost'}>
            {t('hero.colThreeAction')}
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default Home
