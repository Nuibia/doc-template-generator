import React from 'react';
import { Button, Typography, Card, Space } from 'antd';
import { FileTextOutlined, FileMarkdownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Head from 'next/head';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <div className="container">
      <Head>
        <title>文档模板生成器</title>
        <meta name="description" content="通过表单生成富文本和Markdown文档" />
      </Head>

      <div className="page-header">
        <Title level={1}>文档模板生成器</Title>
        <Paragraph className="description">
          通过自定义表单生成富文本和Markdown文档，支持多种平台导出
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="内置模板" variant="borderless">
          <Space size="large">
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <div
                  style={{
                    height: 160,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <FileTextOutlined style={{ fontSize: 64 }} />
                </div>
              }
            >
              <Card.Meta
                title="提测文档"
                description="标准提测文档模板，包含版本、功能点、测试范围等"
              />
              <div style={{ marginTop: 16 }}>
                <Link href="/templates/test-report" passHref>
                  <Button type="primary">使用此模板</Button>
                </Link>
              </div>
            </Card>

            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <div
                  style={{
                    height: 160,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <FileMarkdownOutlined style={{ fontSize: 64 }} />
                </div>
              }
            >
              <Card.Meta
                title="发布计划"
                description="详细的发布计划文档，包含发布时间、功能列表、风险评估等"
              />
              <div style={{ marginTop: 16 }}>
                <Link href="/templates/release-plan" passHref>
                  <Button type="primary">使用此模板</Button>
                </Link>
              </div>
            </Card>
          </Space>
        </Card>

        <Card title="自定义模板" variant="borderless">
          <Paragraph>创建自定义的文档模板，定义表单字段和输出格式</Paragraph>
          <Link href="/templates/custom" passHref>
            <Button type="primary">创建自定义模板</Button>
          </Link>
        </Card>
      </Space>
    </div>
  );
};

export default HomePage;
