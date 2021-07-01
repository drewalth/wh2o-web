import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import { store } from '../store'
import PrimaryNavigation from '../components/global/primary-navigation'
import { Layout } from 'antd'
import { SecondaryNavigation } from '../components/global/secondary-navigation'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { Content, Footer } = Layout
  return (
    <Provider store={store}>
      <Layout>
        <SecondaryNavigation />
        <Layout
          style={{
            minHeight: '100vh',
            maxHeight: '100vh',
            overflowY: 'scroll',
          }}
        >
          <PrimaryNavigation />
          <Content style={{ margin: '0 16px' }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Component {...pageProps} />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>@wh2o</Footer>
        </Layout>
      </Layout>
    </Provider>
  )
}
export default MyApp
