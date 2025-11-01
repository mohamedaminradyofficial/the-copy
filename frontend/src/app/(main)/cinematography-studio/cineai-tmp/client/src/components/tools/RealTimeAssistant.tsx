import React, { useState } from 'react';
import { Input, Button, List, Card, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
}

const RealTimeAssistant: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await axios.post('/api/chat', { message: input });
      const botMessage: Message = { text: response.data.reply, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = { text: t('error-message'), isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card title={t('real-time-assistant')} style={{ height: '400px', overflow: 'auto' }}>
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item style={{ justifyContent: item.isUser ? 'flex-end' : 'flex-start' }}>
              <div style={{
                background: item.isUser ? '#1890ff' : '#f0f0f0',
                color: item.isUser ? 'white' : 'black',
                padding: '8px 12px',
                borderRadius: '8px',
                maxWidth: '70%'
              }}>
                {item.text}
              </div>
            </List.Item>
          )}
        />
        {loading && <Spin style={{ display: 'block', margin: '10px auto' }} />}
      </Card>
      <div style={{ marginTop: 16, display: 'flex' }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('type-message')}
          onPressEnter={handleSend}
          style={{ marginRight: 8 }}
        />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading}>
          {t('send')}
        </Button>
      </div>
    </div>
  );
};

export default RealTimeAssistant;
