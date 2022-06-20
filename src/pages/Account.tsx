import { Layout, Menu, MenuProps, Tabs } from 'antd'
import { Alert } from '../components/User/Alert/Alert'
import { useState } from 'react'
import { UserGages } from '../components/User/Gage/UserGages'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '../hooks'

type Tab = '1' | '2'

const { Content, Sider } = Layout

const Account = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('1')
  const { t } = useTranslation()
  const { isMobile } = useBreakpoint()

  const menuProps: MenuProps = {
    defaultSelectedKeys: [selectedTab],
    onSelect: ({ key }) => setSelectedTab(key as Tab),
    mode: 'inline',
    style: {
      height: '100%',
    },
  }

  return (
    <Layout
      className="site-layout-background"
      style={{ padding: '0', background: '#fff' }}
    >
      {!isMobile ? (
        <Sider width={200}>
          <Menu {...menuProps}>
            <Menu.Item key="1">{t('gages')}</Menu.Item>
            <Menu.Item key="2">{t('alerts')}</Menu.Item>
          </Menu>
        </Sider>
      ) : (
        <div style={{ paddingLeft: 24 }}>
          <Tabs
            defaultActiveKey={selectedTab}
            onChange={(val) => setSelectedTab(val as Tab)}
          >
            <Tabs.TabPane tab={t('gages')} key={'1'}></Tabs.TabPane>
            <Tabs.TabPane tab={t('alerts')} key={'2'}></Tabs.TabPane>
          </Tabs>
        </div>
      )}

      <Content style={{ padding: '24px', minHeight: 500 }}>
        {selectedTab === '1' && <UserGages />}
        {selectedTab === '2' && <Alert />}
      </Content>
    </Layout>
  )
}

export default Account
