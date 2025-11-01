import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Image, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface MoodBoardCreatorProps {}

const MoodBoardCreator: React.FC<MoodBoardCreatorProps> = () => {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-images', { description });
      setImages(response.data.images); // Assuming API returns array of image URLs
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label={t('scene-description')}>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('enter-scene-description')}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleGenerate} loading={loading}>
            {t('generate-mood-board')}
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spin />}
      <Row gutter={16}>
        {images.map((img, index) => (
          <Col span={8} key={index}>
            <Image src={img} alt={`Mood board ${index + 1}`} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MoodBoardCreator;
