import React, { useState } from 'react';
import { Form, Input, Button, Table, Typography, Select } from 'antd';
import { useTranslation } from 'react-i18next';

interface LogEntry {
  key: string;
  scene: string;
  shot: string;
  camera: string;
  lens: string;
  notes: string;
}

const DataLogger: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [form] = Form.useForm();

  const handleAddLog = (values: any) => {
    const newLog: LogEntry = {
      key: Date.now().toString(),
      scene: values.scene,
      shot: values.shot,
      camera: values.camera,
      lens: values.lens,
      notes: values.notes,
    };
    setLogs([...logs, newLog]);
    form.resetFields();
  };

  const columns = [
    { title: t('scene'), dataIndex: 'scene', key: 'scene' },
    { title: t('shot'), dataIndex: 'shot', key: 'shot' },
    { title: t('camera'), dataIndex: 'camera', key: 'camera' },
    { title: t('lens'), dataIndex: 'lens', key: 'lens' },
    { title: t('notes'), dataIndex: 'notes', key: 'notes' },
  ];

  return (
    <div>
      <Form form={form} onFinish={handleAddLog} layout="vertical">
        <Form.Item name="scene" label={t('scene')} rules={[{ required: true }]}>
          <Input placeholder={t('enter-scene')} />
        </Form.Item>
        <Form.Item name="shot" label={t('shot')} rules={[{ required: true }]}>
          <Input placeholder={t('enter-shot')} />
        </Form.Item>
        <Form.Item name="camera" label={t('camera')} rules={[{ required: true }]}>
          <Select placeholder={t('select-camera')}>
            {/* Add options based on common cameras */}
            <Select.Option value="ARRI Alexa">{t('arri-alexa')}</Select.Option>
            <Select.Option value="RED Epic">{t('red-epic')}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="lens" label={t('lens')}>
          <Input placeholder={t('enter-lens')} />
        </Form.Item>
        <Form.Item name="notes" label={t('notes')}>
          <Input.TextArea placeholder={t('enter-notes')} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('add-log')}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={logs} />
    </div>
  );
};

export default DataLogger;
