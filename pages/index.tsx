import { Row, Col, Typography, Button, Tag } from 'antd'
import Link from 'next/link'
import PrimaryNavigation from '../components/global/primary-navigation'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
export default function Home() {
  return (
    <>
      <PrimaryNavigation />
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
                  A community driven guidebook for whitewater rivers and creeks
                  around the world.
                </Typography.Text>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Button style={{ marginRight: 16 }}>
                  <Link href="/rivers">View Rivers</Link>
                </Button>
                <Button>
                  <Link href="/gages">View Gages</Link>
                </Button>
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
            Your browser doesn't support HTML5 video. Here is a
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string)),
    },
  }
}
