import { useState, useEffect } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Breadcrumb, Button, Layout, PageHeader, Typography, Menu } from 'antd'
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
  DownloadOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { withRouter, NextRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'store'
import {
  fetchRiver,
  selectRiverData,
  selectRiverError,
  selectRiverLoading,
} from 'store/slices/river.slice'
import { selectUserIsPublisher } from '../../store/slices/user.slice'
import PrimaryNavigation from '../../components/global/primary-navigation'

interface RiverDetailProps {
  id: number
  router: NextRouter
  apiUrl: string
  awsS3RootPath: string
  mapboxToken: string
}

const RiverDetail = (props: RiverDetailProps) => {
  const { id } = props
  const [activeTab, setActiveTab] = useState('1')
  const dispatch = useAppDispatch()
  const river = useAppSelector(selectRiverData)
  const loading = useAppSelector(selectRiverLoading)
  const error = useAppSelector(selectRiverError)

  useEffect(() => {
    dispatch(fetchRiver(id))
  }, [id])

  return (
    <Layout>
      <PrimaryNavigation />
      <Layout.Content
        style={{
          minHeight: 'calc(100vh - 64px)',
          padding: '0 24px',
        }}
      >
        <Layout.Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Rivers</Breadcrumb.Item>
            <Breadcrumb.Item>{river.name}</Breadcrumb.Item>
          </Breadcrumb>
          <PageHeader
            title={river.name}
            subTitle={river.section}
            onBack={() => props.router.push('/rivers')}
            extra={[
              props.id && <Bookmark key={'bookmark'} riverId={props.id} />,
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
                  Dashboard
                </Menu.Item>
                <Menu.Item icon={<AreaChartOutlined />} key="2">
                  Flow
                </Menu.Item>
                <Menu.Item icon={<EnvironmentOutlined />} key="3">
                  Features
                </Menu.Item>
                <Menu.Item icon={<CameraOutlined />} key="4">
                  Media
                </Menu.Item>
                <Menu.Item icon={<CompassOutlined />} key="5">
                  Map
                </Menu.Item>
                <Menu.Item icon={<NotificationOutlined />} key="6">
                  Board
                </Menu.Item>
                <Menu.Item icon={<UserOutlined />} key="7">
                  Subscribers
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
                </>
              )}
              {activeTab === '2' && (
                <Flow gages={river.gages || []} riverId={props.id} />
              )}
              {activeTab === '3' && (
                <Features riverId={props.id} features={river.features} />
              )}
              {activeTab === '4' && (
                <Gallery
                  id={props.id}
                  apiUrl={props.apiUrl}
                  awsS3RootPath={props.awsS3RootPath}
                  sources={river.media || []}
                />
              )}
              {activeTab === '5' && (
                <RiverMap mapboxToken={props.mapboxToken} />
              )}
              {activeTab === '6' && river.posts && (
                <Board riverId={props.id} posts={river.posts} />
              )}
              {activeTab === '7' && (
                <Subscribers subscribers={river.users || []} />
              )}
            </Layout.Content>
          </Layout>
        </Layout.Content>
      </Layout.Content>
    </Layout>
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
    },
  }
}

export default withRouter(RiverDetail)
