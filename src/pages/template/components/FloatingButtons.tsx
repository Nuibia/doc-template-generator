import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import React from 'react';
import styles from '../index.module.less';

interface FloatingButtonsProps {
  onPreview: () => void;
  onReset: () => void;
}

const FloatingButtons: React.FC<FloatingButtonsProps> = ({ onPreview, onReset }) => {
  return (
    <div className={styles.floatingButtons}>
      <Space direction="vertical">
        <Button type="primary" icon={<EyeOutlined />} onClick={onPreview}>
          预览
        </Button>
        <Button
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: '确认重置',
              content: '确定要重置所有表单内容吗？这将清空所有已填写的内容。',
              onOk: onReset,
              okText: '确认',
              cancelText: '取消',
            });
          }}
        >
          重置
        </Button>
      </Space>
    </div>
  );
};

export default FloatingButtons;
