import { Hero } from './Hero'
import './Home.scss'
import { Button, Col, Row, Typography } from 'antd'
import {
  AreaChartOutlined,
  EyeOutlined,
  NotificationOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const colProps = {
  span: 24,
  sm: 20,
  md: 18,
  lg: 10,
  xl: 5,
}

const Home = () => {
  const navigate = useNavigate()
  return (
    <>
      <Hero />
      <Row className={'feature-row'} justify={'center'}>
        <Col {...colProps} className={'feature-col'}>
          <AreaChartOutlined style={{ fontSize: 48, marginBottom: 8 }} />
          <Typography.Title level={2}>River Flow Data</Typography.Title>
          <Typography.Paragraph style={{ fontSize: '1.125rem' }}>
            View historical river water level data sourced from the United
            States Geological Survey and The Government of Canada.
          </Typography.Paragraph>
          <Button onClick={() => navigate('/gage')} type={'ghost'}>
            Search Gages
          </Button>
        </Col>
        <Col {...colProps} className={'feature-col'}>
          <EyeOutlined style={{ fontSize: 48, marginBottom: 8 }} />
          <Typography.Title level={2}>Forecasting</Typography.Title>
          <Typography.Paragraph style={{ fontSize: '1.125rem' }}>
            Analyze a river's historical water levels with machine learning to
            help you plan your next trip.
          </Typography.Paragraph>
          <Button onClick={() => navigate('/prophet')} type={'ghost'}>
            Search Prophet
          </Button>
        </Col>
        <Col {...colProps} className={'feature-col'}>
          <NotificationOutlined style={{ fontSize: 48, marginBottom: 8 }} />
          <Typography.Title level={2}>Reports</Typography.Title>
          <Typography.Paragraph style={{ fontSize: '1.125rem' }}>
            Create scheduled and immediate alerts summarizing your saved gages
            or latest gage reading via email or SMS.
          </Typography.Paragraph>
          <Button onClick={() => navigate('/auth/login')} type={'ghost'}>
            Get Started
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default Home
