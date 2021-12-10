import { useEffect, useState } from 'react'
import { PageHeader, Layout, Spin, Menu } from 'antd'
import {
  UserRivers,
  UserSettings,
  UserMedia,
  UserGages,
  UserReports,
} from 'components/user'

import { useRouter } from 'next/router'
import { useUserContext } from '../../../components/Provider/UserProvider'
import { useAppContext } from '../../../components/Provider/AppProvider'

const Index = () => {
  const [activeTab, setActiveTab] = useState('1')
  const { user, requestStatus, resetUser } = useUserContext()
  const { windowWidth } = useAppContext()
  const router = useRouter()

  const handleLogout = async () => {
    localStorage.removeItem('wh2o-auth-token')
    resetUser()
    await router.push('/')
  }

  useEffect(() => {
    ;(async () => {
      if (!user) {
        await router.replace('/')
      }
    })()
  }, [])

  const menuStyle = () => {
    if (windowWidth <= 768) {
      return {
        height: 100,
      }
    } else {
      return {
        height: '100%',
      }
    }
  }

  return (
    <>
      <PageHeader
        title="Account"
        subTitle={`${user?.firstName} ${user?.lastName}`}
      />
      <Layout style={{ minHeight: '40vh', padding: '0 24px' }}>
        <Layout.Sider style={{ display: windowWidth > 768 ? 'block' : 'none' }}>
          <Menu
            mode={windowWidth <= 768 ? 'horizontal' : 'inline'}
            defaultSelectedKeys={['1']}
            style={menuStyle()}
            onSelect={({ key }) => {
              setActiveTab(key)
            }}
          >
            <Menu.Item key="1">Gages</Menu.Item>
            <Menu.Item key="2">Rivers</Menu.Item>
            {/*<Menu.Item key="4">Posts</Menu.Item>*/}
            <Menu.Item key="8">Reports</Menu.Item>
            <Menu.Item key="5">Account</Menu.Item>
            <Menu.Divider key="6" />
            <Menu.Item key="7" onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        {!user && requestStatus === 'loading' && (
          <Layout.Content>
            <Spin />
          </Layout.Content>
        )}
        {user && (
          <Layout.Content
            style={{ paddingLeft: windowWidth > 768 ? '24px' : 0 }}
          >
            {windowWidth < 768 && (
              <Menu
                mode={'horizontal'}
                defaultSelectedKeys={['1']}
                style={menuStyle()}
                onSelect={({ key }) => {
                  setActiveTab(key)
                }}
              >
                <Menu.Item key="1">Gages</Menu.Item>
                <Menu.Item key="2">Rivers</Menu.Item>
                {/*<Menu.Item key="4">Posts</Menu.Item>*/}
                <Menu.Item key="8">Reports</Menu.Item>
                <Menu.Item key="5">Account</Menu.Item>
                <Menu.Divider key="6" />
                <Menu.Item key="7" onClick={handleLogout}>
                  Logout
                </Menu.Item>
              </Menu>
            )}

            {activeTab === '1' && user.id && (
              <UserGages userId={user.id} gages={user.gages || []} />
            )}
            {activeTab === '2' && user.id && (
              <UserRivers userId={user.id} reaches={user.reaches || []} />
            )}
            {activeTab === '3' && user.id && (
              <UserMedia userId={user.id} media={user.media || []} />
            )}
            {/*{activeTab === "4" && user.id && (*/}
            {/*  <UserPosts userId={user.id} posts={user.posts || []} />*/}
            {/*)}*/}
            {activeTab === '5' && user.id && <UserSettings user={user} />}
            {activeTab === '8' && user.id && (
              <UserReports
                user={user}
                userVerified={user.verified}
                userTimezone={user.timezone}
                notifications={user.notifications || []}
                userGages={user.gages || []}
              />
            )}
          </Layout.Content>
        )}
      </Layout>
    </>
  )
}

export default Index
