import { useEffect, useState } from 'react'
import { PageHeader, Layout, Spin, Menu } from 'antd'
import {
  Rivers,
  Settings,
  UserMedia,
  UserGages,
  UserPosts,
  Notifications,
} from 'components/user'
import { useAppSelector, useAppDispatch } from 'store'
import {
  selectUserData,
  selectUserLoading,
  resetUser,
} from 'store/slices/user.slice'
import { useRouter } from 'next/router'
import { UserModel } from 'interfaces'

const index = () => {
  const [activeTab, setActiveTab] = useState('1')
  const user = useAppSelector(selectUserData)
  const userLoading = useAppSelector(selectUserLoading)
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

  return (
    <>
      <PageHeader
        title="Account"
        subTitle={`${user.firstName} ${user.lastName}`}
      />
      <Layout style={{ minHeight: '40vh', padding: '0 24px' }}>
        <Layout.Sider>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%' }}
            onSelect={({ key }) => {
              setActiveTab(key)
            }}
          >
            <Menu.Item key="1">Gages</Menu.Item>
            <Menu.Item key="2">Rivers</Menu.Item>
            {/*<Menu.Item key="4">Posts</Menu.Item>*/}
            <Menu.Item key="8">Notifications</Menu.Item>
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
          <Layout.Content style={{ paddingLeft: '24px' }}>
            {activeTab === '1' && user.id && (
              <UserGages userId={user.id} gages={user.gages || []} />
            )}
            {activeTab === '2' && user.id && (
              <Rivers userId={user.id} reaches={user.reaches || []} />
            )}
            {activeTab === '3' && user.id && (
              <UserMedia userId={user.id} media={user.media || []} />
            )}
            {/*{activeTab === "4" && user.id && (*/}
            {/*  <UserPosts userId={user.id} posts={user.posts || []} />*/}
            {/*)}*/}
            {activeTab === '5' && user.id && <Settings user={user} />}
            {activeTab === '8' && user.id && (
              <Notifications
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
