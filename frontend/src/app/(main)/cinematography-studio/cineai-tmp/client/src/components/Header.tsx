import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { t } = useTranslation();

  const menuItems = [
    { key: '1', label: <Link to="/">{t('home')}</Link> },
    { key: '2', label: <Link to="/pre-production">{t('pre-production')}</Link> },
    { key: '3', label: <Link to="/production">{t('production')}</Link> },
    { key: '4', label: <Link to="/post-production">{t('post-production')}</Link> },
  ];

  return (
    <AntHeader style={{ padding: '0 50px' }}>
      <div className="logo" style={{ float: 'right', color: 'white' }}>
        CineAI
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        items={menuItems}
        style={{ float: 'left' }}
      />
    </AntHeader>
  );
};

export default Header;
