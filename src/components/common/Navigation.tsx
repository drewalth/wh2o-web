import React, { ReactNode, useState } from 'react'
import { Layout, Menu, Typography } from 'antd'
import Logo from './Logo'
import { AreaChartOutlined, LoginOutlined, LogoutOutlined, UserOutlined, WifiOutlined } from '@ant-design/icons'
import { useUserContext } from '../user/userContext'
import { setAuthToken } from '../auth'
import { Link, navigate } from 'gatsby'
import { resetCache } from '../apollo/ApolloProvider'

const { Content, Sider } = Layout

type NavigationProps = {
  children: ReactNode
}

type NavItem = {
  path: string
  text: string
  icon: ReactNode
}

const defaultNavItems: NavItem[] = [
  // {
  //   path: '/reach',
  //   text: 'Rivers',
  //   icon: <HeatMapOutlined />
  // },
  {
    path: '/gages',
    text: 'Gages',
    icon: <AreaChartOutlined />
  },
  {
    path: '/status',
    text: 'Status',
    icon: <WifiOutlined />
  }
]

export const Navigation = (props: NavigationProps) => {
  const [_, setLinkPath] = useState('/')
  const user = useUserContext()

  const getNavItems = (): NavItem[] => {
    if (!user.loading && user.data && Object.keys(user.data).length > 0) {
      return [
        ...defaultNavItems,
        {
          path: '/user',
          text: 'Account',
          icon: <UserOutlined />
        },
        {
          path: '/auth/logout',
          text: 'Logout',
          icon: <LogoutOutlined />
        }
      ]
    }
    return [
      ...defaultNavItems,
      {
        path: '/auth/login',
        text: 'Login',
        icon: <LoginOutlined />
      }
    ]
  }

  const navItems = getNavItems()

  const isBrowser = typeof window !== 'undefined'

  const getSelectedItems = (): string[] => {
    return [navItems.find((item) => isBrowser && window.location.href.includes(item.path))?.path || '/']
  }

  const handleNavSelect = async ({ key }: { key: string }) => {
    if (key === '/auth/logout') {
      await resetCache()
      setAuthToken('')
      // history.replace('/');

      setLinkPath('/')
    }

    // history.push(key);
    setLinkPath(key)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint={'lg'} collapsedWidth={0}>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            padding: '24px 16px'
          }}
        >
          <Logo onClick={() => navigate('/')} />
          <Typography.Title level={5} style={{ color: '#fff', lineHeight: 1 }}>
            wh2o
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={getSelectedItems()}
          onSelect={handleNavSelect}
        >
          {navItems.map((item) => (
            <Menu.Item icon={item.icon} key={item.path}>
              <Link to={item.path} key={item.path}>
                {item.text}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px 0', overflowY: 'scroll', maxHeight: '100vh' }}>
          <div style={{ padding: 24, minHeight: 360 }}>{props.children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}
