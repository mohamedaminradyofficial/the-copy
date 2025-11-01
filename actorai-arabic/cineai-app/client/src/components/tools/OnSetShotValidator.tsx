dop\cineai-app\client\src\components\tools\OnSetShotValidator.tsx
import React, { useState } from 'react';
import { Form, Button, Upload, Spin, Typography, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';

interface OnSetShotValidatorProps {}

const OnSetShotValidator: React.FC<OnSetShotValidatorProps> = () => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (fileList.length === 0) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('shot', fileList[0].originFileObj);
    try {
      const response = await axios.post('/api/validate-shot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error validating shot:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: (file: any) => {
      setFileList([]);
    },
    beforeUpload: (file: any) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label={t('upload-shot')}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>{t('select-file')}</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleValidate} loading={loading} disabled={fileList.length === 0}>
            {t('validate-shot')}
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spin />}
      {analysis && (
        <Card title={t('validation-results')}>
          <Typography.Text>{t('framing')}: {analysis.framing}</Typography.Text><br />
          <Typography.Text>{t('composition')}: {analysis.composition}</Typography.Text><br />
          <Typography.Text>{t('lighting-consistency')}: {analysis.lighting}</Typography.Text>
        </Card>
      )}
    </div>
  );
};

export default OnSetShotValidator;
