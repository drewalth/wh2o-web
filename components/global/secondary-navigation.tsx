import { Layout, Menu } from 'antd'
import Link from 'next/link'
import { useAppSelector } from 'store'
import { selectUserData } from 'store/slices/user.slice'
import { selectAppWindowWidth } from 'store/slices/app.slice'
import { NavigationState } from '../../pages/_app'
interface SecondaryNavigationProps extends NavigationState {}

export const SecondaryNavigation = (props: SecondaryNavigationProps) => {
  const user = useAppSelector(selectUserData)
  const windowWidth = useAppSelector(selectAppWindowWidth)

  if (windowWidth > 768) {
    return <></>
  }

  return (
    <Layout.Sider
      trigger={null}
      collapsed={props.sidebarCollapsed}
      collapsedWidth="0"
    >
      <Menu theme="dark" mode="inline" style={{ paddingTop: 60 }}>
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
        {/*  <Link href="/posts">*/}
        {/*    <a>Posts</a>*/}
        {/*  </Link>*/}
        {/*</Menu.Item>*/}
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
    </Layout.Sider>
  )
}
