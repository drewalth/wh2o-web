import { useState } from 'react'
import { PageHeader, Layout, Spin, Menu } from 'antd'
import {
  FlowReport,
  Rivers,
  Settings,
  Media,
  Notifications,
} from 'components/user'
import FlowRangeEditor from 'components/flow-range-editor/flow-range-editor'
import { useAppSelector, useAppDispatch } from 'store'
import {
  selectUserData,
  selectUserLoading,
  resetUser,
} from 'store/slices/user.slice'
import { useRouter } from 'next/router'
import PrimaryNavigation from '../../../components/global/primary-navigation'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const index = () => {
  const [activeTab, setActiveTab] = useState('1')
  const user = useAppSelector(selectUserData)
  const userLoading = useAppSelector(selectUserLoading)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    localStorage.removeItem('wh2o-auth-token')
    dispatch(resetUser())
    await router.push('/')
  }

  return (
    <>
      <PrimaryNavigation />
      <PageHeader
        title="Account"
        subTitle={`${user.firstName} ${user.lastName}`}
      />
      <Layout style={{ minHeight: '40vh' }}>
        <Layout.Sider>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%' }}
            onSelect={({ key }) => {
              setActiveTab(key)
            }}
          >
            <Menu.Item key="1">Dasboard</Menu.Item>
            <Menu.Item key="2">Rivers</Menu.Item>
            <Menu.Item key="3">Media</Menu.Item>
            <Menu.Item key="4">Gages</Menu.Item>
            <Menu.Item key="8">Notifications</Menu.Item>
            <Menu.Item key="5">Settings</Menu.Item>
            <Menu.Divider key="6" />
            <Menu.Item key="7" onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        {!user && userLoading && (
          <Layout.Content>
            <Spin />
          </Layout.Content>
        )}
        {user && !userLoading && (
          <Layout.Content style={{ padding: '24px' }}>
            {activeTab === '1' && <FlowReport gages={user.gages} />}
            {activeTab === '2' && user.id && (
              <Rivers userId={user.id} reaches={user.reaches} />
            )}
            {activeTab === '3' && user.id && (
              <Media userId={user.id} media={user.media} />
            )}
            {activeTab === '8' && user.id && <Notifications userId={user.id} />}
            {activeTab === '4' && user.id && (
              <FlowRangeEditor
                userId={user.id}
                entity="USER"
                // @ts-ignore
                gages={user.gages}
              />
            )}
            {activeTab === '5' && user.id && <Settings user={user} />}
          </Layout.Content>
        )}
      </Layout>
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

export default index
