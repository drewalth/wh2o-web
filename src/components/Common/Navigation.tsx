import React, { ReactNode, useState } from 'react'
import Logo from './wh2o-logo'
import { Layout, Menu, MenuProps, Typography, Divider, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import 'antd/dist/antd.css'
import {
  DashboardOutlined,
  ExportOutlined,
  EyeOutlined,
  ImportOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useUserContext } from '../User/UserContext'
import { languages } from '../../lib/languages'
import './navigation.scss'

type NavigationProps = {
  children: ReactNode
}

const { Content, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const externalLinks: string[] = ['docs']

export const Navigation = ({ children }: NavigationProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUserContext()
  const { t, i18n } = useTranslation()
  const [navOpen, setNavOpen] = useState(false)

  const authItems: MenuItem[] = user
    ? [
        getItem(t('dashboard'), 'user/dashboard', <DashboardOutlined />),
        getItem(t('account'), 'user/settings', <UserOutlined />),
        getItem(t('signOut'), 'auth/logout', <ExportOutlined />),
      ]
    : [getItem(t('signIn'), 'auth/login', <ImportOutlined />)]

  const items: MenuItem[] = [
    getItem(t('search'), 'sub1', <SearchOutlined />, [
      getItem(t('gages'), 'gage'),
      // getItem(t('reaches'), 'reach'),
    ]),
    getItem(t('prophet'), 'prophet', <EyeOutlined />),
    ...authItems,
  ]

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
      className={classNames('navigation', navOpen && 'open')}
    >
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onCollapse={(val) => setNavOpen(!val)}
      >
        <div className={'sider'}>
          <Logo onClick={() => navigate('/', { replace: false })} />
          <Typography.Title level={5} style={{ color: '#fff', lineHeight: 1 }}>
            wh2o
          </Typography.Title>
        </div>
        <Menu
          defaultOpenKeys={['sub1']}
          mode={'inline'}
          theme={'dark'}
          items={items}
          onSelect={({ key }) => {
            if (externalLinks.includes(key)) return
            navigate(`/${key}`)
          }}
        />
        <Divider style={{ backgroundColor: '#fff' }} />
        <Select
          className={'language-select'}
          value={i18n.language}
          onSelect={async (val) => {
            await i18n.changeLanguage(val)
            localStorage.setItem('wh2o-lang', val)
          }}
        >
          {languages.map((l) => (
            <Select.Option key={l.value}>{l.text}</Select.Option>
          ))}
        </Select>
      </Sider>
      <Layout>
        <Content className={contentWrapperClasses}>
          <div className={contentInnerClasses}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}
