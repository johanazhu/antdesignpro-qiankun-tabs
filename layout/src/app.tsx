import Footer from '@/components/Footer';
import Header from '@/components/Header';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { message, Tabs } from 'antd';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import React from 'react';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

export const getCustomTabs = () => {
  return ({ isKeep, keepElements, navigate, dropByCacheKey, activeKey }: any) => {
    console.log('keepElements', keepElements);
    console.log('Object.entries', Object.entries(keepElements.current));

    const items = Object.entries(keepElements.current).map(([pathname, element]: any) => ({
      label: element.name,
      key: pathname,
    }));

    return (
      <div
        className="rumtime-keep-alive-tabs-layout"
        style={{
          zIndex: '100',
          paddingLeft: '200px',
        }}
        hidden={!isKeep}
      >
        <Tabs
          hideAdd
          onChange={(key: string) => {
            navigate(key);
          }}
          activeKey={activeKey}
          type="editable-card"
          items={items}
          onEdit={(targetKey: any) => {
            let newActiveKey = activeKey;
            let lastIndex = -1;
            const newPanel = Object.keys(keepElements.current);
            for (let i = 0; i < newPanel.length; i++) {
              if (newPanel[i] === targetKey) {
                lastIndex = i - 1;
              }
            }
            const newPanes = newPanel.filter((pane) => pane !== targetKey);
            if (newPanes.length && newActiveKey === targetKey) {
              if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex];
              } else {
                newActiveKey = newPanes[0];
              }
            }
            if (lastIndex === -1 && targetKey === location.pathname) {
              message.info('至少要保留一个窗口');
            } else {
              dropByCacheKey(targetKey);
              if (newActiveKey !== location.pathname) {
                navigate(newActiveKey);
              }
            }
          }}
        />
      </div>
    );
  };
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    actionsRender: false,
    headerContentRender: () => <Header />,
    disableContentMargin: false,
    defaultCollapsed: false,
    collapsed: false,
    disableMobile: true,
    menuRender: false,
    menuHeaderRender: false,
    breakpoint: false,
    fixSiderbar: true,
    token: {
      pageContainer: {
        paddingBlockPageContainerContent: 0,
        paddingInlinePageContainerContent: 0,
      },
    },
    contentStyle: {
      margin: '0',
    },

    // menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return <>{children}</>;
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
