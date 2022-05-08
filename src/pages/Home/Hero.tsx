import React, { useEffect, useState } from 'react'
import { Button, Col, Popover, Row, Typography, Grid } from 'antd'
import cover from '../../assets/john-huisjen-cover.jpeg'
import { CameraOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const { useBreakpoint } = Grid

export const Hero = () => {
  const { t } = useTranslation()
  const [titleFontSize, setTitleFontSize] = useState(0)
  const breakpoints = useBreakpoint()
  const currentBreakpoints = Object.keys(breakpoints).filter(
    (key) => breakpoints[key],
  )

  const isMobile =
    (currentBreakpoints.includes('sm') && currentBreakpoints.includes('xs')) ||
    currentBreakpoints.includes('xs')

  const getTitleFontSize = () => {
    const height = window.innerHeight / (isMobile ? 10 : 6)
    setTitleFontSize(height)
  }

  useEffect(() => {
    getTitleFontSize()
  }, [breakpoints])

  return (
    <div
      className={'hero-container'}
      style={{ backgroundImage: `url(${cover})` }}
    >
      <Row align={'middle'} justify={'center'}>
        <Col span={24} xl={12}>
          <Typography.Title
            type={'secondary'}
            style={{
              fontSize: titleFontSize,
              color: '#fff',
              lineHeight: 1,
              paddingTop: 24,
            }}
          >
            w.H<sub>2</sub>O
          </Typography.Title>
          <Typography.Title type={'secondary'} style={{ color: '#fff' }}>
            {t('hero.primary')}
          </Typography.Title>
        </Col>
      </Row>

      <div className={'hero-photo-credit-tooltip'}>
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
