import React, { useState } from 'react';
import { Form, Button, Upload, Spin, Typography, Card, List } from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';

interface ColorGradingAssistantProps {}

const ColorGradingAssistant: React.FC<ColorGradingAssistantProps> = () => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGrade = async () => {
    if (fileList.length === 0) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('media', fileList[0].originFileObj);
    try {
      const response = await axios.post('/api/suggest-color-grading', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setGrades(response.data.grades); // Assuming API returns array of grading suggestions
    } catch (error) {
      console.error('Error suggesting color grading:', error);
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
        <Form.Item label={t('upload-media')}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>{t('select-file')}</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleGrade} loading={loading} disabled={fileList.length === 0}>
            {t('suggest-grading')}
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spin />}
      {grades.length > 0 && (
        <Card title={t('grading-suggestions')}>
          <List
            dataSource={grades}
            renderItem={(grade, index) => (
              <List.Item>
                <Typography.Text>{`${index + 1}. ${grade.description}`}</Typography.Text>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default ColorGradingAssistant;
