import React, { ReactNode, useState } from 'react'
import { Layout, Menu } from 'antd'
import Logo from './Logo'
import {
  AreaChartOutlined,
  LoginOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  UserOutlined
} from '@ant-design/icons'
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
  {
    path: '/gages',
    text: 'Gages',
    icon: <AreaChartOutlined />
  },
  {
    path: '/questions',
    text: 'FAQ',
    icon: <QuestionCircleOutlined />
  },
  {
    path: '/about',
    text: 'About',
    icon: <ReadOutlined />
  }
]

export const Navigation = ({ children }: NavigationProps) => {
  const [linkPath, setLinkPath] = useState('/')
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

  const handleNavSelect = async ({ key }: { key: string }) => {
    if (key === '/auth/logout') {
      await resetCache()
      setAuthToken('')
      setLinkPath('/')
    }
    setLinkPath(key)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint={'lg'} collapsedWidth={0} style={{ zIndex: 2 }}>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            padding: '24px 16px'
          }}
        >
          <Logo
            onClick={() => {
              setLinkPath('/')
              navigate('/')
            }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={[linkPath]}
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
        <Content style={{ margin: '0 16px 0', maxHeight: '100vh' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              maxHeight: '100vh',
              overflowY: 'scroll'
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
