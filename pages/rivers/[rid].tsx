import { useState, useEffect } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Breadcrumb, Button, Layout, PageHeader, Menu, Col, Row } from 'antd'
import {
  BetaBox,
  RiverMedia,
  Features,
  RiverMap,
  Board,
  Bookmark,
  Subscribers,
  Flow,
  BookmarkEntity,
} from 'components/river'
import {
  DashboardOutlined,
  CameraOutlined,
  AreaChartOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  ExportOutlined,
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
import { selectAppWindowWidth } from '../../store/slices/app.slice'
import { exportReachPDF } from '../../controllers/exporter'
import { selectUserData } from '../../store/slices/user.slice'

interface RiverDetailProps {
  id: number
  router: NextRouter
  apiUrl: string
  awsS3RootPath: string
  mapboxToken: string
}

const RiverDetail = (props: RiverDetailProps) => {
  const { id, awsS3RootPath } = props
  const [activeTab, setActiveTab] = useState('1')
  const dispatch = useAppDispatch()
  const river = useAppSelector(selectRiverData)
  const loading = useAppSelector(selectRiverLoading)
  const error = useAppSelector(selectRiverError)
  const windowWidth = useAppSelector(selectAppWindowWidth)
  const user = useAppSelector(selectUserData)

  const handleExport = async (reachId: number) => {
    try {
      const result = await exportReachPDF(reachId)
      const target = document.createElement('a')

      target.href = awsS3RootPath + 'reach-exports/' + result
      target.id = 'export-target'
      target.download = 'true'

      document.querySelector('body')?.appendChild(target)
      ;(document.querySelector('#export-target') as HTMLLinkElement).click()
      ;(document.querySelector('#export-target') as HTMLLinkElement).remove()
    } catch (e) {
      console.log('e', e)
    }
  }

  useEffect(() => {
    dispatch(fetchRiver(id))
  }, [id])

  if (!river) {
    return <></>
  }

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
          onBack={() => props.router.push('/rivers')}
          extra={[
            props.id && (
              <Bookmark
                key={'bookmark'}
                entity={BookmarkEntity.RIVER}
                entityId={props.id}
              />
            ),
            <Button
              disabled={!user || !user.verified}
              title="export"
              onClick={() => handleExport(props.id)}
              icon={<ExportOutlined />}
            >
              Export
            </Button>,
          ]}
        />
        <Layout
          className="site-layout-background"
          style={{ padding: '24px 0' }}
        >
          <Row style={{ width: '100%' }}>
            <Col span={24} sm={24} md={6} lg={4}>
              <Layout.Sider
                className="site-layout-background"
                width="100%"
                style={{ height: '100%' }}
              >
                <Menu
                  mode={windowWidth >= 768 ? 'inline' : 'horizontal'}
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
            </Col>
            <Col span={24} sm={24} md={18} lg={20}>
              <Layout.Content
                style={{
                  padding: '1.25rem',
                  minHeight: 280,
                  backgroundColor: '#fff',
                }}
              >
                {activeTab === '1' && !!river.id && (
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
                  <Features reachId={props.id} features={river.features} />
                )}
                {activeTab === '4' && (
                  <RiverMedia
                    id={props.id}
                    apiUrl={props.apiUrl}
                    awsS3RootPath={props.awsS3RootPath}
                    sources={river.media || []}
                  />
                )}
                {activeTab === '5' && (
                  <RiverMap mapboxToken={props.mapboxToken} />
                )}
                {activeTab === '6' && (
                  <Board reachId={props.id} posts={river.posts || []} />
                )}
                {activeTab === '7' && (
                  <Subscribers subscribers={river.users || []} />
                )}
              </Layout.Content>
            </Col>
          </Row>
        </Layout>
      </Layout.Content>
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
    },
  }
}

export default withRouter(RiverDetail)
