import { useEffect, useState } from 'react'
import { PageHeader, Layout, Spin, Menu } from 'antd'
import {
  UserRivers,
  UserSettings,
  UserMedia,
  UserGages,
  UserReports,
} from 'components/user'
import { useAppSelector, useAppDispatch } from 'store'
import {
  selectUserData,
  selectUserLoading,
  resetUser,
} from 'store/slices/user.slice'
import { useRouter } from 'next/router'
import { UserModel } from 'interfaces'
import { selectAppWindowWidth } from 'store/slices/app.slice'
import { MenuMode } from 'antd/lib/menu'

const index = () => {
  const [activeTab, setActiveTab] = useState('1')
  const user = useAppSelector(selectUserData)
  const userLoading = useAppSelector(selectUserLoading)
  const windowWidth = useAppSelector(selectAppWindowWidth)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    localStorage.removeItem('wh2o-auth-token')
    dispatch(resetUser(UserModel))
    await router.push('/')
  }

  useEffect(() => {
    if (!user && !userLoading) {
      router.replace('/')
    }
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
        subTitle={`${user.firstName} ${user.lastName}`}
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
        {!user && userLoading && (
          <Layout.Content>
            <Spin />
          </Layout.Content>
        )}
        {user && !userLoading && (
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
                userId={user.id}
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

export default index
