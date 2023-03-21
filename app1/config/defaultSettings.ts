import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  // @ts-ignore
  primaryColor: '#1890ff',
  layout: 'side',
  rightContentRender: false,
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  pwa: false,
  headerHeight: 48,
  splitMenus: false,
  menuHeaderRender: false,
  headerRender: false,
  title: 'app1',
  siderWidth: 196,
};

export default Settings;
