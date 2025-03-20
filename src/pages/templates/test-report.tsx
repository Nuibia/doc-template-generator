import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Tabs, Select, DatePicker, Space, Radio, message, Divider, Table, Modal } from 'antd';
import { ArrowLeftOutlined, ExportOutlined, CopyOutlined, EyeOutlined, FileTextOutlined, TeamOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

type Project = {
  repoUrl: string;
  gitUrl: string;
  jenkinsUrl: string;
};

type ServerConfig = {
  name: string;
  code: string;
};

type TemplateFormValues = {
  projectName: string;
  testDate: any;
  prdDocument: string;
  backendDocument: string;
  frontendDocument: string;
  uiDocument: string;
  smokeDoc: string;
  frontendProjects: Project[];
  backendProjects: Project[];
  apolloConfig: string;
  databaseConfig: string;
  jobConfig: string;
  customConfigs: ServerConfig[];
  developBranch: string;
  testBranch: string;
  productManager: string;
  frontendDeveloper: string;
  backendDeveloper: string;
  tester: string;
  attention: string;
  remark: string;
};

const TestReportPage: React.FC = () => {
  const [form] = Form.useForm<TemplateFormValues>();
  const [previewMode, setPreviewMode] = useState<'rich' | 'markdown'>('rich');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('form');

  // 从 localStorage 加载保存的数据
  const loadSavedData = () => {
    const savedData = localStorage.getItem('testReportFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // 处理日期格式
        if (parsedData.testDate) {
          parsedData.testDate = dayjs(parsedData.testDate);
        }
        form.setFieldsValue(parsedData);
      } catch (error) {
        console.error('加载保存的数据失败:', error);
      }
    }
  };

  // 保存数据到 localStorage
  const saveToLocalStorage = (values: TemplateFormValues) => {
    try {
      localStorage.setItem('testReportFormData', JSON.stringify(values));
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    localStorage.removeItem('testReportFormData');
    setGeneratedContent('');
  };

  // 监听表单值变化
  const handleFormValuesChange = (changedValues: any, allValues: TemplateFormValues) => {
    // 处理日期格式
    const formattedValues = {
      ...allValues,
      testDate: allValues.testDate ? allValues.testDate.format('YYYY-MM-DD') : ''
    };
    const markdownContent = generateMarkdown(formattedValues);
    setGeneratedContent(markdownContent);
    // 实时保存到 localStorage
    saveToLocalStorage(allValues);
  };

  // 组件加载时加载保存的数据
  React.useEffect(() => {
    loadSavedData();
  }, []);

  const handleFormSubmit = (values: TemplateFormValues) => {
    setActiveTab('preview');
  };

  const generateMarkdown = (values: TemplateFormValues): string => {
    const frontendProjectsTable = values.frontendProjects?.map((project: Project) => 
      `| ${project.repoUrl} | ${project.gitUrl} | ${project.jenkinsUrl} |`
    ).join('\n') || '';

    const backendProjectsTable = values.backendProjects?.map((project: Project) => 
      `| ${project.repoUrl} | ${project.gitUrl} | ${project.jenkinsUrl} |`
    ).join('\n') || '';

    const customConfigsTable = values.customConfigs?.map((config: ServerConfig) => 
      `| ${config.name} | \`\`\`\n${config.code}\n\`\`\` |`
    ).join('\n') || '';

    return `# ${values.projectName} 提测文档

## 基本信息

- **项目名称**: ${values.projectName}
- **提测时间**: ${values.testDate}
- **相关文档**:
  - **PRD原型稿**: ${values.prdDocument}
${values.backendDocument ? `  - **后端技术文档**: ${values.backendDocument}` : ''}
${values.frontendDocument ? `  - **前端技术文档**: ${values.frontendDocument}` : ''}
${values.uiDocument ? `  - **UI稿**: ${values.uiDocument}` : ''}
${values.smokeDoc ? `  - **冒烟文档**: ${values.smokeDoc}` : ''}

## 项目信息

### 前端项目
| 仓库地址 | Git地址 | Jenkins地址 |
|---------|---------|-------------|
${frontendProjectsTable}

### 后端项目
| 仓库地址 | Git地址 | Jenkins地址 |
|---------|---------|-------------|
${backendProjectsTable}

## 服务端配置

${values.apolloConfig ? `### Apollo配置
\`\`\`
${values.apolloConfig}
\`\`\`
` : ''}

${values.databaseConfig ? `### 数据库配置
\`\`\`
${values.databaseConfig}
\`\`\`
` : ''}

${values.jobConfig ? `### 定时脚本&消费队列
\`\`\`
${values.jobConfig}
\`\`\`
` : ''}

${customConfigsTable ? `### 自定义配置
| 配置名称 | 配置代码 |
|---------|---------|
${customConfigsTable}` : ''}

- **开发分支**: ${values.developBranch}
- **测试分支**: ${values.testBranch}

## 项目参与人员

- **产品人员**: ${values.productManager}
- **前端开发**: ${values.frontendDeveloper}
- **后端开发**: ${values.backendDeveloper}
- **测试人员**: ${values.tester}

## 注意事项

${values.attention || '无特别注意事项'}

## 备注

${values.remark || '无'}
`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
      .then(() => {
        message.success('内容已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  const exportToMarkdown = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.getFieldValue('projectName')}-提测文档.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <Head>
        <title>提测文档模板 - 文档模板生成器</title>
      </Head>

      <div className="page-header">
        <Space>
          <Link href="/" passHref>
            <Button icon={<ArrowLeftOutlined />} type="link">返回首页</Button>
          </Link>
          <Title level={2} style={{ margin: 0 }}>提测文档模板</Title>
        </Space>
        <Paragraph className="description">
          填写以下信息，自动生成标准格式的提测文档
        </Paragraph>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="表单填写" key="form">
          <Card bordered={false} className="form-container">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit}
              onValuesChange={handleFormValuesChange}
              initialValues={{
                projectName: '',
                testDate: '',
                prdDocument: '',
                backendDocument: '',
                frontendDocument: '',
                uiDocument: '',
                smokeDoc: '',
                frontendProjects: [],
                backendProjects: [],
                apolloConfig: '',
                databaseConfig: '',
                jobConfig: '',
                customConfigs: [],
                developBranch: 'feature/',
                testBranch: 'test/',
                productManager: '',
                frontendDeveloper: '',
                backendDeveloper: '',
                tester: '',
                attention: '',
                remark: ''
              }}
            >
              <Form.Item
                name="projectName"
                label="项目名称"
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>

              <Form.Item
                name="testDate"
                label="提测时间"
                rules={[{ required: true, message: '请选择提测时间' }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>

              <Divider orientation="left">
                <Space>
                  <FileTextOutlined />
                  <span>文档</span>
                </Space>
              </Divider>

              <Form.Item
                name="prdDocument"
                label="PRD原型稿"
                rules={[{ required: true, message: '请输入PRD文档链接' }]}
              >
                <Input placeholder="请输入PRD文档链接" />
              </Form.Item>

              <Form.Item
                name="backendDocument"
                label="后端技术文档"
              >
                <Input placeholder="请输入后端技术文档链接（选填）" />
              </Form.Item>

              <Form.Item
                name="frontendDocument"
                label="前端技术文档"
              >
                <Input placeholder="请输入前端技术文档链接（选填）" />
              </Form.Item>

              <Form.Item
                name="uiDocument"
                label="UI稿"
              >
                <Input placeholder="请输入UI稿链接（选填）" />
              </Form.Item>

              <Form.Item
                name="smokeDoc"
                label="冒烟文档"
              >
                <Input placeholder="请输入冒烟文档链接（选填）" />
              </Form.Item>

              <Divider orientation="left">
                <Space>
                  <FileTextOutlined />
                  <span>项目</span>
                </Space>
              </Divider>

              <Form.List name="frontendProjects">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <React.Fragment key={key}>
                        <Card style={{ marginBottom: 16 }} extra={<Button type="link" danger icon={<DeleteOutlined />} onClick={() => remove(name)}>删除</Button>}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Form.Item
                              {...restField}
                              name={[name, 'repoUrl']}
                              label="仓库地址"
                              rules={[{ required: true, message: '请输入前端项目仓库地址' }]}
                            >
                              <Input placeholder="请输入前端项目仓库地址" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'gitUrl']}
                              label="Git地址"
                              rules={[{ required: true, message: '请输入前端项目Git地址' }]}
                            >
                              <Input placeholder="请输入前端项目Git地址" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'jenkinsUrl']}
                              label="Jenkins地址"
                              rules={[{ required: true, message: '请输入前端项目Jenkins地址' }]}
                            >
                              <Input placeholder="请输入前端项目Jenkins地址" />
                            </Form.Item>
                          </Space>
                        </Card>
                        <Button 
                          type="dashed" 
                          onClick={() => add(undefined, index + 1)} 
                          block 
                          icon={<PlusOutlined />}
                          style={{ marginBottom: 16 }}
                        >
                          添加前端项目
                        </Button>
                      </React.Fragment>
                    ))}
                    {fields.length === 0 && (
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block 
                        icon={<PlusOutlined />}
                        style={{ marginBottom: 16 }}
                      >
                        添加前端项目
                      </Button>
                    )}
                  </>
                )}
              </Form.List>

              <Form.List name="backendProjects">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <React.Fragment key={key}>
                        <Card style={{ marginBottom: 16 }} extra={<Button type="link" danger icon={<DeleteOutlined />} onClick={() => remove(name)}>删除</Button>}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Form.Item
                              {...restField}
                              name={[name, 'repoUrl']}
                              label="仓库地址"
                              rules={[{ required: true, message: '请输入后端项目仓库地址' }]}
                            >
                              <Input placeholder="请输入后端项目仓库地址" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'gitUrl']}
                              label="Git地址"
                              rules={[{ required: true, message: '请输入后端项目Git地址' }]}
                            >
                              <Input placeholder="请输入后端项目Git地址" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'jenkinsUrl']}
                              label="Jenkins地址"
                              rules={[{ required: true, message: '请输入后端项目Jenkins地址' }]}
                            >
                              <Input placeholder="请输入后端项目Jenkins地址" />
                            </Form.Item>
                          </Space>
                        </Card>
                        <Button 
                          type="dashed" 
                          onClick={() => add(undefined, index + 1)} 
                          block 
                          icon={<PlusOutlined />}
                          style={{ marginBottom: 16 }}
                        >
                          添加后端项目
                        </Button>
                      </React.Fragment>
                    ))}
                    {fields.length === 0 && (
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block 
                        icon={<PlusOutlined />}
                        style={{ marginBottom: 16 }}
                      >
                        添加后端项目
                      </Button>
                    )}
                  </>
                )}
              </Form.List>

              <Divider orientation="left">
                <Space>
                  <FileTextOutlined />
                  <span>服务端配置</span>
                </Space>
              </Divider>

              <Form.Item
                name="apolloConfig"
                label="Apollo配置"
              >
                <TextArea
                  placeholder="请输入Apollo配置代码段"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="databaseConfig"
                label="数据库配置"
              >
                <TextArea
                  placeholder="请输入数据库配置代码段"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="jobConfig"
                label="定时脚本&消费队列"
              >
                <TextArea
                  placeholder="请输入定时脚本/消费队列代码段"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>

              <Form.List name="customConfigs">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <React.Fragment key={key}>
                        <Card style={{ marginBottom: 16 }} extra={<Button type="link" danger icon={<DeleteOutlined />} onClick={() => remove(name)}>删除</Button>}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              label="配置名称"
                              rules={[{ required: true, message: '请输入配置名称' }]}
                            >
                              <Input placeholder="请输入配置名称" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'code']}
                              label="配置代码"
                              rules={[{ required: true, message: '请输入配置代码段' }]}
                            >
                              <TextArea
                                placeholder="请输入配置代码段"
                                autoSize={{ minRows: 4, maxRows: 8 }}
                              />
                            </Form.Item>
                          </Space>
                        </Card>
                        <Button 
                          type="dashed" 
                          onClick={() => add(undefined, index + 1)} 
                          block 
                          icon={<PlusOutlined />}
                          style={{ marginBottom: 16 }}
                        >
                          添加自定义配置
                        </Button>
                      </React.Fragment>
                    ))}
                    {fields.length === 0 && (
                      <Button 
                        type="dashed" 
                        onClick={() => add()} 
                        block 
                        icon={<PlusOutlined />}
                        style={{ marginBottom: 16 }}
                      >
                        添加自定义配置
                      </Button>
                    )}
                  </>
                )}
              </Form.List>

              <Form.Item
                name="developBranch"
                label="开发分支"
                rules={[{ required: true, message: '请输入开发分支' }]}
              >
                <Input placeholder="如: feature/xxx" />
              </Form.Item>

              <Form.Item
                name="testBranch"
                label="测试分支"
                rules={[{ required: true, message: '请输入测试分支' }]}
              >
                <Input placeholder="如: test/xxx" />
              </Form.Item>

              <Divider orientation="left">
                <Space>
                  <TeamOutlined />
                  <span>项目参与人员</span>
                </Space>
              </Divider>

              <Form.Item
                name="productManager"
                label="产品人员"
                rules={[{ required: true, message: '请输入产品人员' }]}
              >
                <Input placeholder="产品人员姓名，多人用逗号分隔" />
              </Form.Item>

              <Form.Item
                name="frontendDeveloper"
                label="前端开发人员"
                rules={[{ required: true, message: '请输入前端开发人员' }]}
              >
                <Input placeholder="前端开发人员姓名，多人用逗号分隔" />
              </Form.Item>

              <Form.Item
                name="backendDeveloper"
                label="后端开发人员"
                rules={[{ required: true, message: '请输入后端开发人员' }]}
              >
                <Input placeholder="后端开发人员姓名，多人用逗号分隔" />
              </Form.Item>

              <Form.Item
                name="tester"
                label="测试人员"
                rules={[{ required: true, message: '请输入测试人员' }]}
              >
                <Input placeholder="测试人员姓名，多人用逗号分隔" />
              </Form.Item>

              <Form.Item
                name="attention"
                label="注意事项"
              >
                <TextArea
                  placeholder="需要特别注意的地方"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item
                name="remark"
                label="备注"
              >
                <TextArea
                  placeholder="其他需要备注的信息"
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="预览文档" key="preview">
          <Card bordered={false}>
            <div style={{ marginBottom: 16 }}>
              <Radio.Group 
                value={previewMode} 
                onChange={(e) => setPreviewMode(e.target.value)}
                buttonStyle="solid"
                style={{ marginBottom: 16 }}
              >
                <Radio.Button value="rich">富文本预览</Radio.Button>
                <Radio.Button value="markdown">Markdown预览</Radio.Button>
              </Radio.Group>
              
              <Space style={{ float: 'right' }}>
                <Button 
                  icon={<CopyOutlined />} 
                  onClick={copyToClipboard}
                >
                  复制到剪贴板
                </Button>
                <Button 
                  type="primary" 
                  icon={<ExportOutlined />} 
                  onClick={exportToMarkdown}
                >
                  导出Markdown
                </Button>
              </Space>
            </div>

            <div className="preview-container">
              {previewMode === 'rich' ? (
                <div className="markdown-content">
                  <ReactMarkdown>{generatedContent}</ReactMarkdown>
                </div>
              ) : (
                <pre style={{ whiteSpace: 'pre-wrap' }}>{generatedContent}</pre>
              )}
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {/* 固定位置的按钮组 */}
      {activeTab === 'form' && (
        <div style={{
          position: 'fixed',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#fff',
          padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: '0 8px 8px 0',
          zIndex: 1000,
        }}>
          <Space direction="vertical">
            <Button 
              type="primary" 
              icon={<EyeOutlined />}
              onClick={() => {
                form.validateFields()
                  .then(() => setActiveTab('preview'))
                  .catch(() => message.error('请填写必填项'));
              }}
            >
              预览
            </Button>
            <Button 
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: '确认重置',
                  content: '确定要重置所有表单内容吗？这将清空所有已填写的内容。',
                  onOk: handleReset,
                  okText: '确认',
                  cancelText: '取消',
                });
              }}
            >
              重置
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};

export default TestReportPage; 