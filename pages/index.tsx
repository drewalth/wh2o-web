import { Row, Col, Typography, Button, Tag } from 'antd'
import Link from 'next/link'
export default function Home() {
  return (
    <>
      <div
        className="hero"
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          maxHeight: 'calc(100vh - 64px)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <Row
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
          }}
          align="middle"
          justify="center"
        >
          <Col span={24} md={16} lg={14} style={{ paddingLeft: 24 }}>
            <Row style={{ marginBottom: 24 }}>
              <Col span={24} md={16} lg={12}>
                <Tag color="blue">Alpha</Tag>
                <Typography.Title
                  style={{ color: '#fff', fontSize: '96px', lineHeight: 0.5 }}
                >
                  wh2o
                </Typography.Title>
                <Typography.Text
                  style={{
                    fontSize: '1.5rem',
                    lineHeight: 1.25,
                    color: '#fff',
                  }}
                >
                  Download river information for offline use, track river flows,
                  and create custom flow reports via email and SMS messaging.
                </Typography.Text>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Link href="/rivers">
                  <Button
                    style={{ marginRight: 16, color: '#fff' }}
                    type="ghost"
                  >
                    View Rivers
                  </Button>
                </Link>
                <Link href="/gages">
                  <Button style={{ color: '#fff' }} type="ghost">
                    View Gages
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <video
          id="video"
          className="hero__video"
          loop
          muted
          preload="metadata"
          autoPlay
          style={{
            left: '50%',
            minHeight: '100%',
            minWidth: '100%',
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: -1,
            opacity: 1,
          }}
        >
          <source
            className="video__source"
            type="video/mp4"
            src="https://wh2o-app.s3-us-west-1.amazonaws.com/landing-comp-02.mp4"
          />
          <p>
            {"Your browser doesn't support HTML5 video. Here is a"}
            <a href="https://wh2o-app.s3-us-west-1.amazonaws.com/landing-comp-02.mp4">
              link to the video
            </a>
            instead.
          </p>
        </video>
      </div>
    </>
  )
}
