import { Layout, Menu } from 'antd'
import { Alert } from '../components/User/Alert/Alert'
import { useState } from 'react'
import { UserGages } from '../components/User/Gage/UserGages'
import { useTranslation } from 'react-i18next'

type Tab = '1' | '2'

const { Content, Sider } = Layout

const Account = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('1')
  const { t } = useTranslation()

  return (
    <Layout
      className="site-layout-background"
      style={{ padding: '0', background: '#fff' }}
    >
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%' }}
          onSelect={({ key }) => setSelectedTab(key as Tab)}
        >
          <Menu.Item key="1">{t('gages')}</Menu.Item>
          <Menu.Item key="2">{t('alerts')}</Menu.Item>
        </Menu>
      </Sider>
      <Content style={{ padding: '24px', minHeight: 500 }}>
        {selectedTab === '1' && <UserGages />}
        {selectedTab === '2' && <Alert />}
      </Content>
    </Layout>
  )
}

export default Account
