import { Layout, Menu, Select, Tag, Typography } from 'antd'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from 'store'
import {
  selectUserData,
  setUser,
  setUserError,
  setUserLoading,
} from 'store/slices/user.slice'
import { authRefresh } from 'controllers'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

const PrimaryNavigation = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation('common')
  const user = useAppSelector(selectUserData)
  const router = useRouter()
  const { locale } = router
  const { i18n } = useTranslation()
  const refreshUser = async () => {
    try {
      dispatch(setUserLoading(true))
      const result = await authRefresh()
      dispatch(setUser(result))
    } catch (e) {
      console.log('e', e)
      dispatch(setUserError(true))
    } finally {
      dispatch(setUserLoading(false))
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const changeLocale = async (locale: string) => {
    if (i18n && i18n.changeLanguage) {
      await i18n.changeLanguage(locale)
      router.locale = locale
    }
  }

  return (
    <Layout.Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/">
          <Typography.Title
            level={3}
            style={{ color: '#fff', marginBottom: 0 }}
          >
            wh2o
          </Typography.Title>
        </Link>
        <div style={{ marginLeft: 8 }}>
          <Tag color="blue">Alpha</Tag>
        </div>
      </div>
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="1">
          <Link href="/rivers">Rivers</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link href="/gages">Gages</Link>
        </Menu.Item>
        <Menu.Item key="3">
          {!user.email ? (
            <Link key="login" href="/auth/login">
              Sign In
            </Link>
          ) : (
            <Link key="dashboard" href={`/user/${user.id}`}>
              Dashboard
            </Link>
          )}
        </Menu.Item>
        {/* set default to user default */}
        <Select defaultValue={locale} onChange={(evt) => changeLocale(evt)}>
          <Select.Option value="en">En</Select.Option>
          <Select.Option value="es">Es</Select.Option>
          <Select.Option value="fr">Fr</Select.Option>
          <Select.Option value="de">De</Select.Option>
          <Select.Option value="pt">Pt</Select.Option>
        </Select>
      </Menu>
    </Layout.Header>
  )
}

export default PrimaryNavigation
