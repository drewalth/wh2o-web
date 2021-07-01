import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import { store } from '../store'
import PrimaryNavigation from "../components/global/primary-navigation";
import {Layout} from "antd";
import {useRouter} from "next/router";

const MyApp = ({ Component, pageProps }: AppProps) => {
    const router = useRouter()
  return (
    <Provider store={store}>
      <Layout>
          <PrimaryNavigation />
          <Layout.Content  style={{
              minHeight: 'calc(100vh - 64px)',
              maxHeight: 'calc(100vh - 64px)',
              overflowY: 'scroll',
              padding: router.route === '/' ? '0' :'0 24px',
          }}>
              <Component {...pageProps} />
          </Layout.Content>
      </Layout>
    </Provider>
  )
}
export default MyApp
