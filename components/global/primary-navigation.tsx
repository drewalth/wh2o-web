import { Layout, Menu, Typography } from 'antd'
import Link from 'next/link'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from 'store'
import {
  selectUserData,
  setUser,
  setUserLoading,
} from 'store/slices/user.slice'
import { authRefresh } from 'controllers'
import { useEffect } from 'react'
import { selectAppWindowWidth, setWidth } from '../../store/slices/app.slice'

const PrimaryNavigation = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUserData)
  const windowWidth = useAppSelector(selectAppWindowWidth)

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
    refreshUser()
    dispatch(setWidth(window.innerWidth))
    window.addEventListener('resize', () =>
      dispatch(setWidth(window.innerWidth))
    )
  }, [])

  return (
    <>
      <Layout.Header
        style={{
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
        </div>
        {windowWidth > 768 && (
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
        )}
      </Layout.Header>
    </>
  )
}

export default PrimaryNavigation
