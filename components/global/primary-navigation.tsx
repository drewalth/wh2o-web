import { Layout, Menu, Tooltip, Typography } from 'antd'
import Link from 'next/link'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from 'store'
import { FrownTwoTone } from '@ant-design/icons'
import {
  selectUserData,
  setUser,
  setUserLoading,
} from 'store/slices/user.slice'
import { authRefresh } from 'controllers'
import { createElement, useEffect, useState } from 'react'
import { selectAppWindowWidth, setWidth } from 'store/slices/app.slice'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { NavigationState } from 'pages/_app'
import { ping } from 'controllers'
import debounce from 'lodash.debounce'

interface PrimaryNavProps extends NavigationState {}

const PrimaryNavigation = (props: PrimaryNavProps) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUserData)
  const windowWidth = useAppSelector(selectAppWindowWidth)
  const [apiConnected, setApiConnected] = useState(true)

  const getApiStatus = async () => {
    try {
      await ping()
      await setApiConnected(true)
    } catch (e) {
      await setApiConnected(false)
    }
  }

  const refreshUser = async () => {
    try {
      dispatch(setUserLoading(true))
      const result = await authRefresh()
      dispatch(setUser(result))
    } catch (e) {
    } finally {
      dispatch(setUserLoading(false))
    }
  }

  useEffect(() => {
    getApiStatus()
  }, [apiConnected])

  useEffect(() => {
    refreshUser()
    dispatch(setWidth(window.innerWidth))
    window.addEventListener(
      'resize',
      debounce(() => dispatch(setWidth(window.innerWidth)), 250)
    )
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
            <Menu.Item key="4">
              <Link href="/posts">
                <a>Posts</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              {!user.email ? (
                <Link key="login" href="/auth/login">
                  <a>Sign In</a>
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
