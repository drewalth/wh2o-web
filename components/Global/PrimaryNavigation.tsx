import { Button, Layout, Menu, Tooltip, Typography } from 'antd'
import Link from 'next/link'
import Image from 'next/image'
import { FrownTwoTone } from '@ant-design/icons'
import { createElement, useEffect, useState } from 'react'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { NavigationState } from 'pages/_app'
import { ping } from 'controllers'
import { useUserContext } from '../Provider/UserProvider'
import { useAppContext } from '../Provider/AppProvider'

interface PrimaryNavProps extends NavigationState {}

const PrimaryNavigation = (props: PrimaryNavProps) => {
  const [apiConnected, setApiConnected] = useState(true)
  const { user } = useUserContext()
  const { windowWidth } = useAppContext()

  const getApiStatus = async () => {
    try {
      await ping()
      setApiConnected(true)
    } catch (e) {
      setApiConnected(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      await getApiStatus()
    })()
  }, [])

  return (
    <>
      <Layout.Header
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ height: 38 }}>
            <Link href="/">
              <a>
                <Image src="/img/wh2o-logo.svg" height={38} width={67} />
              </a>
            </Link>
          </div>
          <Link href="/">
            <a>
              <Typography.Title
                level={3}
                style={{ color: '#fff', marginBottom: 0, marginLeft: 12 }}
              >
                wh2o
              </Typography.Title>
            </a>
          </Link>
          {!apiConnected && (
            <div>
              <Tooltip placement="bottom" title="API Disconnected">
                <FrownTwoTone
                  twoToneColor="#E74C3C"
                  style={{ fontSize: 24, marginLeft: 16 }}
                />{' '}
              </Tooltip>
            </div>
          )}
        </div>
        {windowWidth > 768 ? (
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">
              <Link href="/rivers">
                <a>Rivers</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link href="/gages">
                <a>Gages</a>
              </Link>
            </Menu.Item>
            {/*<Menu.Item key="4">*/}
            {/*  <Link href="/pricing">*/}
            {/*    <a>Pricing</a>*/}
            {/*  </Link>*/}
            {/*</Menu.Item>*/}
            {/*<Menu.Item key="4">*/}
            {/*  <Link href="/posts">*/}
            {/*    <a>Posts</a>*/}
            {/*  </Link>*/}
            {/*</Menu.Item>*/}
            <Menu.Item key="3">
              {!user ? (
                <Link key="login" href="/auth/login">
                  <Button>Login</Button>
                </Link>
              ) : (
                <Link key="dashboard" href={`/user/${user.id}`}>
                  <a>Dashboard</a>
                </Link>
              )}
            </Menu.Item>
          </Menu>
        ) : (
          <div
            onClick={() => props.setSidebarCollapsed(!props.sidebarCollapsed)}
          >
            <Typography.Link style={{ color: '#fff', marginRight: 8 }}>
              Menu
            </Typography.Link>
            {createElement(
              props.sidebarCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                style: {
                  color: '#fff',
                },
              }
            )}
          </div>
        )}
      </Layout.Header>
    </>
  )
}

export default PrimaryNavigation
