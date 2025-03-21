import React, { useState } from 'react';
import { Modal, Button, Radio, message, Space, Input, Form } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import platforms from '../platforms';

interface ExportModalProps {
  content: string;
  title: string;
  visible: boolean;
  onCancel: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ content, title, visible, onCancel }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0].id);
  const [exporting, setExporting] = useState(false);
  const [form] = Form.useForm();

  const handleExport = async () => {
    try {
      const values = await form.validateFields();
      setExporting(true);

      const platform = platforms.find(p => p.id === selectedPlatform);
      if (!platform) {
        message.error('无效的平台选择');
        return;
      }

      const result = await platform.export(content, {
        title: values.documentTitle || title,
        ...values,
      });

      if (result) {
        message.success(`已成功导出到${platform.name}`);
        onCancel();
      } else {
        message.error(`导出到${platform.name}失败`);
      }
    } catch (error) {
      console.error('Export error:', error);
      message.error('导出过程中发生错误');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal
      title="导出文档"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="export"
          type="primary"
          icon={<ExportOutlined />}
          loading={exporting}
          onClick={handleExport}
        >
          导出
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          documentTitle: title,
        }}
      >
        <Form.Item
          name="documentTitle"
          label="文档标题"
          rules={[{ required: true, message: '请输入文档标题' }]}
        >
          <Input placeholder="请输入文档标题" />
        </Form.Item>

        <Form.Item label="选择平台">
          <Radio.Group value={selectedPlatform} onChange={e => setSelectedPlatform(e.target.value)}>
            <Space direction="vertical">
              {platforms.map(platform => (
                <Radio key={platform.id} value={platform.id}>
                  {platform.name} - {platform.description}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        {selectedPlatform === 'wiki' && (
          <Form.Item
            name="wikiSpace"
            label="Wiki空间"
            rules={[{ required: true, message: '请输入Wiki空间名称' }]}
          >
            <Input placeholder="请输入Wiki空间名称" />
          </Form.Item>
        )}

        {selectedPlatform === 'feishu' && (
          <Form.Item
            name="feishuFolder"
            label="飞书文档夹"
            rules={[{ required: true, message: '请输入飞书文档夹' }]}
          >
            <Input placeholder="请输入飞书文档夹" />
          </Form.Item>
        )}

        {selectedPlatform === 'yuque' && (
          <>
            <Form.Item
              name="yuqueRepo"
              label="语雀知识库"
              rules={[{ required: true, message: '请输入语雀知识库' }]}
            >
              <Input placeholder="请输入语雀知识库" />
            </Form.Item>
            <Form.Item name="yuqueGroup" label="语雀分组">
              <Input placeholder="请输入语雀分组（可选）" />
            </Form.Item>
          </>
        )}

        {selectedPlatform === 'notion' && (
          <Form.Item
            name="notionDatabase"
            label="Notion数据库ID"
            rules={[{ required: true, message: '请输入Notion数据库ID' }]}
          >
            <Input placeholder="请输入Notion数据库ID" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ExportModal;
