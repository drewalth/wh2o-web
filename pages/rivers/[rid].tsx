import { useState, useEffect } from 'react'
import { getRiver } from 'controllers'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Breadcrumb, Button, Layout, PageHeader, Typography, Menu } from 'antd'
import { IRiver, RiverModel } from 'interfaces'
import {
  BetaBox,
  Gallery,
  Features,
  RiverMap,
  Board,
  Bookmark,
  Subscribers,
  Flow,
} from 'components/river'
import {
  DashboardOutlined,
  CameraOutlined,
  AreaChartOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  GithubOutlined,
  DownloadOutlined,
  FacebookOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { withRouter, NextRouter } from 'next/router'

interface RiverDetailProps {
  id: number
  router: NextRouter
  apiUrl: string
  awsS3RootPath: string
  mapboxToken: string
}

interface RiverDetailState {
  river: IRiver
  loading: boolean
  error: boolean
  activeTab: string
}

const RiverDetail = (props: RiverDetailProps) => {
  const { t } = useTranslation('common')
  const [river, setRiver] = useState<IRiver>({ ...RiverModel })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState('1')

  const load = async (id: number) => {
    try {
      setLoading(true)
      const result = await getRiver(id)
      console.log(result)
      setRiver(result)
    } catch (e) {
      console.log('e', e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(props.id)
  }, [])

  return (
    <>
      <Layout.Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Rivers</Breadcrumb.Item>
          <Breadcrumb.Item>{river.name}</Breadcrumb.Item>
        </Breadcrumb>
        <PageHeader
          title={river.name}
          subTitle={river.section}
          onBack={() => props.router.push('/reaches')}
          extra={[
            props.id && <Bookmark key={'bookmark'} riverId={props.id} />,
            <Button icon={<FacebookOutlined />}>
              <></>
            </Button>,
            <Button title="download" icon={<DownloadOutlined />}>
              <></>
            </Button>,
          ]}
        />
        <Layout
          className="site-layout-background"
          style={{ padding: '24px 0' }}
        >
          <Layout.Sider className="site-layout-background" width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%' }}
              onSelect={({ key }) => setActiveTab(key)}
            >
              <Menu.Item icon={<DashboardOutlined />} key="1">
                {t('menu.dashboard')}
              </Menu.Item>
              <Menu.Item icon={<AreaChartOutlined />} key="2">
                {t('common.flow')}
              </Menu.Item>
              <Menu.Item icon={<EnvironmentOutlined />} key="3">
                {t('common.features')}
              </Menu.Item>
              <Menu.Item icon={<CameraOutlined />} key="4">
                {t('common.media')}
              </Menu.Item>
              <Menu.Item icon={<CompassOutlined />} key="5">
                {t('common.map')}
              </Menu.Item>
              <Menu.Item icon={<NotificationOutlined />} key="6">
                {t('common.board')}
              </Menu.Item>
              <Menu.Item icon={<UserOutlined />} key="7">
                {t('common.subscribers')}
              </Menu.Item>
            </Menu>
          </Layout.Sider>
          <Layout.Content
            style={{
              padding: '1.25rem',
              minHeight: 280,
              backgroundColor: '#fff',
            }}
          >
            {activeTab === '1' && (
              <>
                <RiverMap mapboxToken={props.mapboxToken} />
                <div style={{ marginBottom: 20 }} />
                <BetaBox river={river} loading={loading} error={error} />
                <Typography.Paragraph>{river.description}</Typography.Paragraph>
              </>
            )}
            {activeTab === '2' && <Flow gages={river.gages} />}
            {activeTab === '3' && (
              <Features riverId={props.id} features={river.features} />
            )}
            {activeTab === '4' && (
              <Gallery
                id={props.id}
                apiUrl={props.apiUrl}
                awsS3RootPath={props.awsS3RootPath}
                sources={river.media}
              />
            )}
            {activeTab === '5' && <RiverMap mapboxToken={props.mapboxToken} />}
            {activeTab === '6' && river.posts && (
              <Board riverId={props.id} posts={river.posts} />
            )}
            {activeTab === '7' && <Subscribers subscribers={river.users} />}
          </Layout.Content>
        </Layout>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>
        <Button href="https://github.com/drewalth/wh2o" target="_blank">
          <GithubOutlined />
        </Button>
      </Layout.Footer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      id: Number(context.query.rid),
      apiUrl: process.env.API_BASE_URL || '',
      awsS3RootPath: process.env.AWS_S3_BASE_URL,
      mapboxToken: process.env.MAPBOX_ACCESS_TOKEN || '',
      ...(await serverSideTranslations(context.locale as string)),
    },
  }
}

export default withRouter(RiverDetail)
