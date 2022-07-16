import { useState } from 'react'
import { Layout, Menu, MenuProps, Tabs } from 'antd'
import { useParams } from 'react-router-dom'
import { Hero } from './Hero'
import { useBreakpoint } from '../../../hooks'
import { Description } from './Description'
import { Features } from './Features/Features'
import { Media } from './Media/Media'
import { ReachDetailProvider } from './ReachDetailProvider'
import { Access } from './Access/Access'

type Tab = '1' | '2' | '3' | '4' | '5' | '6'

const { Sider, Content } = Layout

export const ReachDetail = () => {
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
    'Summary',
    'Features',
    'Media',
    'Access',
    // 'Posts',
    // 'Subscribers',
  ]

  const getSelectedTab = () => {
    switch (selectedTab) {
      case '4':
        return <Access />
      case '3':
        return <Media />
      case '2':
        return <Features />
      case '1':
      default:
        return <Description />
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
          <div>
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
