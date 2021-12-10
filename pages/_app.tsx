import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'antd/dist/antd.css'
import PrimaryNavigation from '../components/Global/PrimaryNavigation'
import { Layout } from 'antd'
import { SecondaryNavigation } from '../components/Global/SecondaryNavigation'
import { useState } from 'react'
import { AppProvider } from '../components/Provider/AppProvider'
import { UserProvider } from '../components/Provider/UserProvider'
import { RiversProvider } from '../components/Provider/RiversProvider'
import { RiverProvider } from '../components/Provider/RiverProvider'
import { GagesProvider } from '../components/Provider/GagesProvider'

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
    <AppProvider>
      <UserProvider>
        <GagesProvider>
          <RiversProvider>
            <RiverProvider>
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
            </RiverProvider>
          </RiversProvider>
        </GagesProvider>
      </UserProvider>
    </AppProvider>
  )
}
export default MyApp
