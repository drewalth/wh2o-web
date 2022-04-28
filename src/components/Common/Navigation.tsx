import React, { ReactNode } from 'react'
import Logo from './wh2o-logo'
import { Layout, Menu, Typography } from 'antd'
import 'antd/dist/antd.css'
import {
  ExportOutlined,
  ImportOutlined,
  MailOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useUserContext } from '../User/UserContext'
import { User } from '../../types'

type NavigationProps = {
  children: ReactNode
}

const { Content, Sider } = Layout

export type NavItem = {
  path: string
  text: string
  icon: ReactNode
}

const baseNavItems: NavItem[] = [
  {
    path: '/explore',
    text: 'Explore',
    icon: <SearchOutlined />,
  },
]

const getNavItems = (user: User | undefined): NavItem[] => {
  if (!!user) {
    return [
      ...baseNavItems,
      {
        path: '/user/alerts',
        text: 'Alerts',
        icon: <MailOutlined />,
      },
      {
        path: '/user/settings',
        text: 'Account',
        icon: <UserOutlined />,
      },
      {
        path: '/auth/logout',
        text: 'Sign Out',
        icon: <ExportOutlined />,
      },
    ]
  }

  return [
    ...baseNavItems,
    {
      path: '/auth/login',
      text: 'Sign In',
      icon: <ImportOutlined />,
    },
  ]
}

export const Navigation = ({ children }: NavigationProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUserContext()

  const navItems = getNavItems(user)

  const getSelectedItems = (): string[] => {
    return [
      navItems.find((item) => location.pathname === item.path)?.path || '/',
    ]
  }

  const currentPath = location.pathname

  const contentWrapperClasses = classNames(
    'content-wrapper',
    currentPath === '/' ? 'home' : '',
  )
  const contentInnerClasses = classNames(
    'site-layout-background',
    'content-inner',
    currentPath === '/' ? 'home' : '',
  )

  return (
    <Layout
      style={{ minHeight: '100vh', maxHeight: '100vh' }}
      className={'navigation'}
    >
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        zeroWidthTriggerStyle={{ top: 0 }}
      >
        <div className={'sider'}>
          <Logo onClick={() => navigate('/', { replace: false })} />
          <Typography.Title level={5} style={{ color: '#fff', lineHeight: 1 }}>
            wh2o
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['explore']}
          selectedKeys={getSelectedItems()}
          onSelect={({ key }) => navigate(key, { replace: false })}
        >
          {navItems.map((item) => (
            <Menu.Item key={item.path} icon={item.icon}>
              {item.text}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Content className={contentWrapperClasses}>
          <div className={contentInnerClasses}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}
