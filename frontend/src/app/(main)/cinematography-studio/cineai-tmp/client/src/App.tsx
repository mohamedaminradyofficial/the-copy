<file_path>
dop\cineai-app\client\src\App.tsx
</file_path>

<edit_description>
Create App.tsx with basic structure for the CineAI app, including routing for pre-production, production, and post-production stages
</edit_description>

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import PreProduction from './pages/PreProduction';
import Production from './pages/Production';
import PostProduction from './pages/PostProduction';
import Header from './components/Header';
import { useTranslation } from 'react-i18next';

const { Content } = Layout;

function App() {
  const { t } = useTranslation();

  return (
    <Layout>
      <Header />
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Routes>
            <Route path="/" element={<div>{t('welcome')}</div>} />
            <Route path="/pre-production" element={<PreProduction />} />
            <Route path="/production" element={<Production />} />
            <Route path="/post-production" element={<PostProduction />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
