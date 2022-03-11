import React, { ReactNode } from 'react';
import { Layout, Menu, Typography } from 'antd';
import Logo from './Logo';
const { Content, Sider } = Layout;
import { AreaChartOutlined, UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useUserContext } from '../user/userContext';
import { setAuthToken } from '../auth';

type NavigationProps = {
  children: ReactNode;
};

type NavItem = {
  path: string;
  text: string;
  icon: ReactNode;
};

const defaultNavItems: NavItem[] = [
  // {
  //   path: '/reach',
  //   text: 'Rivers',
  //   icon: <HeatMapOutlined />
  // },
  {
    path: '/gage',
    text: 'Gages',
    icon: <AreaChartOutlined />
  }
];

export const Navigation = ({ children }: NavigationProps) => {
  const history = useHistory();
  const location = useLocation();
  const user = useUserContext();

  const getNavItems = (): NavItem[] => {
    if (!user.loading && user.data && Object.keys(user.data).length > 0) {
      return [
        ...defaultNavItems,
        {
          path: '/user',
          text: 'Account',
          icon: <UserOutlined />
        },
        {
          path: '/logout',
          text: 'Logout',
          icon: <LogoutOutlined />
        }
      ];
    }
    return [
      ...defaultNavItems,
      {
        path: '/login',
        text: 'Login',
        icon: <LoginOutlined />
      }
    ];
  };

  const navItems = getNavItems();

  const getSelectedItems = (): string[] => {
    return [navItems.find((item) => location.pathname.includes(item.path))?.path || '/'];
  };

  const handleNavSelect = ({ key }: { key: string }) => {
    if (key === '/logout') {
      setAuthToken('');
      history.replace('/');
      return;
    }

    history.push(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint={'lg'} collapsedWidth={0}>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            padding: '24px 16px'
          }}
        >
          <Logo
            onClick={() => {
              console.log('click home');
            }}
          />
          <Typography.Title level={5} style={{ color: '#fff', lineHeight: 1 }}>
            wh2o
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={getSelectedItems()}
          onSelect={handleNavSelect}
        >
          {navItems.map((item) => (
            <Menu.Item key={item.path} icon={item.icon}>
              {item.text}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
