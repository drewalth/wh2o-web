import React, { ReactNode } from 'react'
import Logo from './wh2o-logo'
import { Layout, Menu, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import 'antd/dist/antd.css'
import {
  DashboardOutlined,
  ExportOutlined,
  EyeOutlined,
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

export const Navigation = ({ children }: NavigationProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUserContext()
  const { t } = useTranslation()

  const baseNavItems: NavItem[] = [
    {
      path: '/gage',
      text: t('search'),
      icon: <SearchOutlined />,
    },
    {
      path: '/prophet',
      text: t('prophet'),
      icon: <EyeOutlined />,
    },
    {
      path: '/contact',
      text: t('contact'),
      icon: <MailOutlined />,
    },
  ]

  const getNavItems = (user: User | undefined): NavItem[] => {
    if (!!user) {
      return [
        ...baseNavItems,
        {
          path: '',
          text: 'divider',
          icon: <></>,
        },
        {
          path: '/user/dashboard',
          text: t('dashboard'),
          icon: <DashboardOutlined />,
        },
        {
          path: '/user/settings',
          text: t('account'),
          icon: <UserOutlined />,
        },
        {
          path: '/auth/logout',
          text: t('signOut'),
          icon: <ExportOutlined />,
        },
      ]
    }

    return [
      ...baseNavItems,
      {
        path: '/auth/login',
        text: t('signIn'),
        icon: <ImportOutlined />,
      },
    ]
  }

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
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className={'sider'}>
          <Logo onClick={() => navigate('/', { replace: false })} />
          <Typography.Title level={5} style={{ color: '#fff', lineHeight: 1 }}>
            wh2o
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={getSelectedItems()}
          onSelect={({ key }) => navigate(key, { replace: false })}
        >
          {navItems.map((item) => {
            if (item.text === 'divider') {
              return <Menu.Divider />
            }

            return (
              <Menu.Item key={item.path} icon={item.icon}>
                {item.text}
              </Menu.Item>
            )
          })}
          <Menu.Item style={{ position: 'absolute', bottom: 0 }} key={'/legal'}>
            {t('disclaimer')}
          </Menu.Item>
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
