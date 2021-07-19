import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import { store } from '../store'
import PrimaryNavigation from '../components/global/primary-navigation'
import { Layout } from 'antd'
import { SecondaryNavigation } from '../components/global/secondary-navigation'
import { useState } from 'react'

export interface NavigationState {
  setSidebarCollapsed: Function
  sidebarCollapsed: boolean
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { Content } = Layout
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const navState = {
    sidebarCollapsed,
    setSidebarCollapsed,
  }

  return (
    <Provider store={store}>
      <Layout hasSider={true}>
        <Layout
          style={{
            minHeight: '100vh',
            maxHeight: '100vh',
            overflowY: 'scroll',
          }}
        >
          <PrimaryNavigation {...navState} />
          <Content style={{ maxHeight: '100%', paddingTop: 64 }}>
            <Component {...pageProps} />
          </Content>
        </Layout>
        <SecondaryNavigation {...navState} />
      </Layout>
    </Provider>
  )
}
export default MyApp
