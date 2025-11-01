import React, { useState } from 'react';
import { Form, Button, Select, Checkbox, Spin, Typography, Card, List } from 'antd';
import { useTranslation } from 'react-i18next';

interface DeliveryManagerProps {}

const DeliveryManager: React.FC<DeliveryManagerProps> = () => {
  const { t } = useTranslation();
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateDeliverables = async () => {
    if (selectedFormats.length === 0) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setDeliverables(selectedFormats.map(format => ({ format, status: 'ready' })));
      setLoading(false);
    }, 1000);
  };

  const formatOptions = [
    { value: 'mp4', label: 'MP4' },
    { value: 'mov', label: 'MOV' },
    { value: 'dcp', label: 'DCP' },
  ];

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label={t('select-formats')}>
          <Select
            mode="multiple"
            placeholder={t('choose-formats')}
            value={selectedFormats}
            onChange={setSelectedFormats}
            options={formatOptions}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleGenerateDeliverables} loading={loading} disabled={selectedFormats.length === 0}>
            {t('generate-deliverables')}
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spin />}
      {deliverables.length > 0 && (
        <Card title={t('delivery-deliverables')}>
          <List
            dataSource={deliverables}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text>{`${item.format}: ${item.status}`}</Typography.Text>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default DeliveryManager;
