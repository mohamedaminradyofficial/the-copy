import React, { useState } from 'react';
import { Form, Input, Button, List, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface EquipmentOptimizerProps {}

const EquipmentOptimizer: React.FC<EquipmentOptimizerProps> = () => {
  const { t } = useTranslation();
  const [requirements, setRequirements] = useState('');
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    if (!requirements.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/optimize-equipment', { requirements });
      setEquipment(response.data.equipment); // Assuming API returns array of equipment objects
    } catch (error) {
      console.error('Error optimizing equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label={t('project-requirements')}>
          <Input.TextArea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder={t('enter-project-requirements')}
            rows={5}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleOptimize} loading={loading}>
            {t('optimize-equipment')}
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spin />}
      {equipment.length > 0 && (
        <List
          header={<div>{t('recommended-equipment')}</div>}
          bordered
          dataSource={equipment}
          renderItem={(item, index) => (
            <List.Item>
              <Typography.Text>{`${item.type}: ${item.suggestion}`}</Typography.Text>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default EquipmentOptimizer;
