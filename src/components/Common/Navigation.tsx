import React, { ReactNode, useEffect, useState } from 'react'
import Logo from './wh2o-logo'
import { Layout, Menu, Select, Typography } from 'antd'
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
import { Locale, User } from '../../types'
import { useTranslation } from 'react-i18next'

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
  const { t, i18n } = useTranslation()
  const [currentLocale, setCurrentLocale] = useState<Locale>(Locale.EN)

  useEffect(() => {
    ;(async () => {
      await i18n.changeLanguage(currentLocale)
    })()
  }, [currentLocale])

  const baseNavItems: NavItem[] = [
    {
      path: '/prophet',
      text: 'Prophet',
      icon: <EyeOutlined />,
    },
    {
      path: '/gage',
      text: t('menu.search'),
      icon: <SearchOutlined />,
    },
    {
      path: '/contact',
      text: t('common.contact'),
      icon: <MailOutlined />,
    },
  ]

  const getNavItems = (user: User | undefined): NavItem[] => {
    if (!!user) {
      return [
        {
          path: '/user/dashboard',
          text: t('menu.dashboard'),
          icon: <DashboardOutlined />,
        },
        ...baseNavItems,
        {
          path: '/user/settings',
          text: t('menu.profile'),
          icon: <UserOutlined />,
        },
        {
          path: '/auth/logout',
          text: t('usermenu.signout'),
          icon: <ExportOutlined />,
        },
      ]
    }

    return [
      ...baseNavItems,
      {
        path: '/auth/login',
        text: t('usermenu.signin'),
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
          {navItems.map((item) => (
            <Menu.Item key={item.path} icon={item.icon}>
              {item.text}
            </Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Item>
            <Select
              style={{ color: '#fff' }}
              bordered={false}
              showArrow
              value={currentLocale}
              onSelect={(val) => {
                setCurrentLocale(val)
              }}
            >
              {Object.values(Locale).map((l) => (
                <Select.Option key={l} value={l}>
                  {l}
                </Select.Option>
              ))}
            </Select>
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
