import React, {useState} from 'react';
import {Layout, Menu} from 'antd';
import {UserGages} from '../../components/user/UserGages';
import {UserNotifications} from '../../components/user/UserNotifications';
import {UserSettings} from '../../components/user/UserSettings';

const {Content, Sider} = Layout;

type Tabs = '1' | '2' | '3' | '4' | '5';

const Index = () => {
    const [activeTab, setActiveTab] = useState<Tabs>('1');

    return (
        <Layout className="site-layout-background" style={{padding: '24px 0'}}>
            <Sider className="site-layout-background" width={200}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{height: '100%'}}
                    onSelect={({key}) => setActiveTab(key as Tabs)}
                >
                    <Menu.Item key="1">Gages</Menu.Item>
                    <Menu.Item key="2">Notifications</Menu.Item>
                    {/*<Menu.Item key="3">Reaches</Menu.Item>*/}
                    {/*<Menu.Item key="4">Profile</Menu.Item>*/}
                    <Menu.Item key="5">Settings</Menu.Item>
                </Menu>
            </Sider>
            <Content style={{padding: '0 24px', minHeight: 280}}>
                {activeTab === '1' && <UserGages/>}
                {activeTab === '2' && <UserNotifications/>}
                {activeTab === '3' && <div>three</div>}
                {activeTab === '4' && <div>four</div>}
                {activeTab === '5' && <UserSettings/>}
            </Content>
        </Layout>
    );
};

export default Index
