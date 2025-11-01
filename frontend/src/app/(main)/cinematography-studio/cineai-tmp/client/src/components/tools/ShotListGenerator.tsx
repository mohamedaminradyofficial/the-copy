<file_path>
dop\cineai-app\client\src\components\tools\ShotListGenerator.tsx
</file_path>

<edit_description>
Create ShotListGenerator component
</edit_description>

import React, { useState } from 'react';
import { Form, Input, Button, List, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface ShotListGeneratorProps {}

const ShotListGenerator: React.FC<ShotListGeneratorProps> = () => {
  const { t } = useTranslation();
  const [script, setScript] = useState('');
  const [shots, setShots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!script.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-shots', { script });
      setShots(response.data.shots); // Assuming API returns array of shot objects
    } catch (error) {
      console.error('Error generating shots:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label={t('script-input')}>
          <Input.TextArea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder={t('enter-script')}
            rows={10}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleGenerate} loading={loading}>
            {t('generate-shot-list')}
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spin />}
      {shots.length > 0 && (
        <List
          header={<div>{t('shot-list')}</div>}
          bordered
          dataSource={shots}
          renderItem={(shot, index) => (
            <List.Item>
              <Typography.Text>{`${index + 1}. ${shot.description}`}</Typography.Text>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ShotListGenerator;
