import React, { useState } from 'react';
import { Form, Button, Upload, Spin, Typography, Card, List } from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';

interface EditorialAssistantProps {}

const EditorialAssistant: React.FC<EditorialAssistantProps> = () => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (fileList.length === 0) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('footage', fileList[0].originFileObj);
    try {
      const response = await axios.post('/api/analyze-footage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuggestions(response.data.suggestions); // Assuming API returns array of suggestions
    } catch (error) {
      console.error('Error analyzing footage:', error);
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
        <Form.Item label={t('upload-footage')}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>{t('select-file')}</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAnalyze} loading={loading} disabled={fileList.length === 0}>
            {t('analyze-footage')}
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spin />}
      {suggestions.length > 0 && (
        <Card title={t('editorial-suggestions')}>
          <List
            dataSource={suggestions}
            renderItem={(suggestion, index) => (
              <List.Item>
                <Typography.Text>{`${index + 1}. ${suggestion.description}`}</Typography.Text>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default EditorialAssistant;
