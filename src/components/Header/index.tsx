import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';
import styles from './styles.module.css';

const { Title, Paragraph } = Typography;

interface HeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backButtonTo?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  description,
  showBackButton = false,
  backButtonTo = '/',
}) => {
  return (
    <div className={styles.pageHeader}>
      <Space>
        {showBackButton && (
          <Link href={backButtonTo} passHref>
            <Button icon={<ArrowLeftOutlined />} type="link">
              返回首页
            </Button>
          </Link>
        )}
        <Title level={2} style={{ margin: 0 }}>
          {title}
        </Title>
      </Space>
      {description && <Paragraph className={styles.description}>{description}</Paragraph>}
    </div>
  );
};

export default Header;
