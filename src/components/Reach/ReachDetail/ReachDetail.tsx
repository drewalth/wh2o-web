import { useState } from 'react'
import { Layout, Menu, MenuProps, Tabs } from 'antd'
import { useParams } from 'react-router-dom'
import { Hero } from './Hero'
import { useBreakpoint } from '../../../hooks'
import { Summary } from './Summary/Summary'
import { Features } from './Features/Features'
import { Media } from './Media/Media'
import { ReachDetailProvider } from './ReachDetailProvider'
import { Access } from './Access/Access'
import { Source } from './Source/Source'
import { useTranslation } from 'react-i18next'
import { Flow } from './Flow/Flow'

type Tab = '1' | '2' | '3' | '4' | '5' | '6'

const { Sider, Content } = Layout

export const ReachDetail = () => {
  const { t } = useTranslation()
  const { id: reachId } = useParams()
  const [selectedTab, setSelectedTab] = useState<Tab>('1')
  const { isMobile } = useBreakpoint()

  const menuProps: MenuProps = {
    defaultSelectedKeys: [selectedTab],
    onSelect: ({ key }) => setSelectedTab(key as Tab),
    mode: 'inline',
    style: {
      height: '100%',
    },
  }

  const tabs: string[] = [
    t('summary'),
    t('flow'),
    t('features'),
    t('media'),
    t('access'),
    t('source'),
    // 'Posts',
    // 'Subscribers',
  ]

  const getSelectedTab = () => {
    switch (selectedTab) {
      case '1':
      default:
        return <Summary />
      case '2':
        return <Flow />
      case '3':
        return <Features />
      case '4':
        return <Media />
      case '5':
        return <Access />
      case '6':
        return <Source />
    }
  }

  return (
    <ReachDetailProvider reachId={reachId}>
      <Hero />
      <Layout
        className="site-layout-background"
        style={{ padding: '0', background: '#fff' }}
      >
        {isMobile ? (
          <div style={{ padding: '0 24px' }}>
            <Tabs>
              {tabs.map((tb, idx) => (
                <Tabs.TabPane tab={tb} key={(idx + 1).toLocaleString()} />
              ))}
            </Tabs>
          </div>
        ) : (
          <Sider width={200}>
            <Menu {...menuProps}>
              {tabs.map((tb, idx) => (
                <Menu.Item key={(idx + 1).toLocaleString()}>{tb}</Menu.Item>
              ))}
            </Menu>
          </Sider>
        )}
        <Content style={{ padding: '24px', minHeight: 500 }}>
          {getSelectedTab()}
        </Content>
      </Layout>
    </ReachDetailProvider>
  )
}
