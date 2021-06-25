import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'antd/dist/antd.css'
import { Layout } from 'antd'
import { Provider } from 'react-redux'
import { store } from '../store'
import PrimaryNavigation from '../components/global/primary-navigation'
import { useRouter } from 'next/router'
import { appWithTranslation } from 'next-i18next'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const contentStyle = {
    minHeight: 'calc(100vh - 64px)',
    padding: router.pathname === '/' ? 0 : '0 24px',
  }

  return (
    <Provider store={store}>
      <Layout>
        <PrimaryNavigation />
        <Layout.Content style={contentStyle}>
          <Component {...pageProps} />
        </Layout.Content>
      </Layout>
    </Provider>
  )
}
export default appWithTranslation(MyApp)
