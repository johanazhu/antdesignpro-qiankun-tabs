import { history, useModel } from '@umijs/max';
import { Divider, Menu, Spin } from 'antd';
import { memo, useEffect, useState } from 'react';
import styles from './index.less';

const Header: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [selectedKey, setSelectedKey] = useState<any>(['/app1']);

  useEffect(() => {
    if (history.location.pathname.indexOf('/app1') > -1) {
      setSelectedKey('/app1');
    } else if (history.location.pathname.indexOf('/app2') > -1) {
      setSelectedKey('/app2');
    }
  }, []);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginInlineEnd: 52,
      }}
    >
      <Divider
        style={{
          height: '1.5em',
          backgroundColor: '#dfdfdf',
        }}
        type="vertical"
      />
      <Menu
        style={{
          flex: '1 1 0%',
          // backgroundColor: 'rgba(240, 242, 245, 0.4)',
          backgroundColor: 'rgba(240, 242, 245, 0)',
        }}
        mode="horizontal"
        selectedKeys={selectedKey}
        items={[
          {
            label: 'app1',
            key: '/app1',
          },
          {
            label: 'app2',
            key: '/app2',
          },
        ]}
        onClick={({ key, keyPath, domEvent }) => {
          history.push(key);
          setSelectedKey([key]);
        }}
      ></Menu>
    </div>
  );
};

export default memo(Header);
