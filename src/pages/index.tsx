import { TemplateCard, TemplateCardContainer } from '@/components';
import { CalendarOutlined, FileMarkdownOutlined, FileTextOutlined } from '@ant-design/icons';
import { Card, Space, Typography } from 'antd';
import Head from 'next/head';
import React from 'react';

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
        <Paragraph className="description">通过自定义表单生成富文本和Markdown文档</Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="内置模板" variant="borderless">
          <TemplateCardContainer>
            <TemplateCard
              icon={<FileTextOutlined style={{ fontSize: 64 }} />}
              title="提测文档"
              description="标准提测文档模板，包含版本、功能点、测试范围等"
              templateId="test-report"
            />

            <TemplateCard
              icon={<CalendarOutlined style={{ fontSize: 64 }} />}
              title="周报"
              description="标准周报模板，包含项目进展、问题思考等"
              templateId="weekly-report"
            />

            <TemplateCard
              icon={<FileMarkdownOutlined style={{ fontSize: 64 }} />}
              title="发布计划"
              description="详细的发布计划文档，包含发布时间、功能列表、风险评估等"
              templateId="release-plan"
            />
          </TemplateCardContainer>
        </Card>
        {/* TODO: 未来支持自定义模板 */}
        {/* <Card title="自定义模板" variant="borderless">
          <Paragraph>创建自定义的文档模板，定义表单字段和输出格式</Paragraph>
          <Link href="/template?id=custom" passHref>
            <Button type="primary">创建自定义模板</Button>
          </Link>
        </Card> */}
      </Space>
    </div>
  );
};

export default HomePage;
