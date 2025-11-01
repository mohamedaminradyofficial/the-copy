import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Spin, Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface LocationScoutProps {}

const LocationScout: React.FC<LocationScoutProps> = () => {
  const { t } = useTranslation();
  const [locationUrl, setLocationUrl] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!locationUrl.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/analyze-location', { locationUrl });
      setAnalysis(response.data); // Assuming API returns analysis object
    } catch (error) {
      console.error('Error analyzing location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label={t('location-url')}>
          <Input
            value={locationUrl}
            onChange={(e) => setLocationUrl(e.target.value)}
            placeholder={t('enter-location-url')}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAnalyze} loading={loading}>
            {t('analyze-location')}
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spin />}
      {analysis && (
        <div>
          <Card title={t('lighting-analysis')}>
            <Typography.Text>{analysis.lighting}</Typography.Text>
          </Card>
          <Card title={t('camera-suggestions')}>
            <Typography.Text>{analysis.camera}</Typography.Text>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LocationScout;
