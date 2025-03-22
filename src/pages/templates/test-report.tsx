import {
  ArrowLeftOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExportOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Tabs,
  Typography,
  message,
} from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import testReportTemplate, { TemplateField } from '../../templates/testReport';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 将表单值类型定义为Record<string, any>以便与模板定义匹配
type TemplateFormValues = Record<string, any>;

const TestReportPage: React.FC = () => {
  const [form] = Form.useForm<TemplateFormValues>();
  const [previewMode, setPreviewMode] = useState<'rich' | 'markdown'>('rich');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('form');

  // 从 localStorage 加载保存的数据
  const loadSavedData = () => {
    const savedData = localStorage.getItem(`${testReportTemplate.id}FormData`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.setFieldsValue(parsedData);
        // 加载数据后生成内容
        const markdownContent = testReportTemplate.generateMarkdown(parsedData);
        setGeneratedContent(markdownContent);
      } catch (error) {
        console.error('加载保存的数据失败:', error);
      }
    }
  };

  // 保存数据到 localStorage
  const saveToLocalStorage = (values: TemplateFormValues) => {
    try {
      localStorage.setItem(`${testReportTemplate.id}FormData`, JSON.stringify(values));
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    localStorage.removeItem(`${testReportTemplate.id}FormData`);
    setGeneratedContent('');
  };

  // 监听表单值变化
  const handleFormValuesChange = (changedValues: any, allValues: TemplateFormValues) => {
    const markdownContent = testReportTemplate.generateMarkdown(allValues);
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

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generatedContent)
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

  // 动态渲染表单字段
  const renderFormFields = (fields: TemplateField[], parentPath = '') => {
    // 字段渲染策略，使用策略模式替代switch-case
    const fieldRenderers = {
      text: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules}>
          <Input placeholder={field.placeholder} defaultValue={field.defaultValue} />
        </Form.Item>
      ),

      textarea: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules}>
          <TextArea
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
      ),

      date: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules}>
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>
      ),

      select: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules}>
          <Select placeholder={field.placeholder} defaultValue={field.defaultValue}>
            {field.options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),

      checkbox: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item
          key={field.id}
          name={fieldName}
          label={field.label}
          rules={rules}
          valuePropName="checked"
        >
          <Checkbox>{field.label}</Checkbox>
        </Form.Item>
      ),

      radio: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules}>
          <Radio.Group>
            {field.options?.map(option => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      ),

      group: (field: TemplateField, fieldName: string, rules: any) => (
        <React.Fragment key={field.id}>
          <Divider orientation="left">
            <Space>
              <FileTextOutlined />
              <span>{field.label}</span>
            </Space>
          </Divider>
          {field.children && renderFormFields(field.children, fieldName)}
        </React.Fragment>
      ),

      table: (field: TemplateField, fieldName: string, rules: any) => (
        <React.Fragment key={field.id}>
          <Divider orientation="left">{field.label}</Divider>
          <Form.List name={fieldName}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <React.Fragment key={key}>
                    <Card
                      style={{ marginBottom: 16 }}
                      extra={
                        <Button
                          type="link"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        >
                          删除
                        </Button>
                      }
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {field.columns?.map(column => {
                          const columnName = `${name}.${column.name}`;
                          const columnRules = column.required
                            ? [{ required: true, message: `请输入${column.label}` }]
                            : undefined;

                          // 对表格列使用策略模式处理不同类型
                          const columnRenderers = {
                            textarea: (
                              <Form.Item
                                key={column.id}
                                {...restField}
                                name={columnName}
                                label={column.label}
                                rules={columnRules}
                              >
                                <TextArea
                                  placeholder={column.placeholder}
                                  autoSize={{ minRows: 3, maxRows: 6 }}
                                />
                              </Form.Item>
                            ),

                            text: (
                              <Form.Item
                                key={column.id}
                                {...restField}
                                name={columnName}
                                label={column.label}
                                rules={columnRules}
                              >
                                <Input placeholder={column.placeholder} />
                              </Form.Item>
                            ),
                          };

                          // 返回对应类型的渲染组件或默认文本输入
                          return (
                            columnRenderers[column.type as keyof typeof columnRenderers] ||
                            columnRenderers.text
                          );
                        })}
                      </Space>
                    </Card>
                    <Button
                      type="dashed"
                      onClick={() => add(undefined, index + 1)}
                      block
                      icon={<PlusOutlined />}
                      style={{ marginBottom: 16 }}
                    >
                      添加{field.label}
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
                    添加{field.label}
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </React.Fragment>
      ),
    };

    return fields.map(field => {
      const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name;
      const rules = field.required
        ? [{ required: true, message: `请输入${field.label}` }]
        : undefined;

      // 使用策略模式：根据字段类型选择对应的渲染函数
      const renderer = fieldRenderers[field.type as keyof typeof fieldRenderers];
      return renderer ? renderer(field, fieldName, rules) : null;
    });
  };

  // 表单内容
  const formContent = (
    <Card variant="borderless" className="form-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        onValuesChange={handleFormValuesChange}
        initialValues={{}}
      >
        {renderFormFields(testReportTemplate.fields)}
      </Form>
    </Card>
  );

  // 预览内容
  const previewContent = (
    <Card variant="borderless">
      <div style={{ marginBottom: 16 }}>
        <Radio.Group
          value={previewMode}
          onChange={e => setPreviewMode(e.target.value)}
          buttonStyle="solid"
          style={{ marginBottom: 16 }}
        >
          <Radio.Button value="rich">富文本预览</Radio.Button>
          <Radio.Button value="markdown">Markdown预览</Radio.Button>
        </Radio.Group>

        <Space style={{ float: 'right' }}>
          <Button icon={<CopyOutlined />} onClick={copyToClipboard}>
            复制到剪贴板
          </Button>
          <Button type="primary" icon={<ExportOutlined />} onClick={exportToMarkdown}>
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
  );

  // Tab配置
  const tabItems = [
    {
      key: 'form',
      label: '表单填写',
      children: formContent,
    },
    {
      key: 'preview',
      label: '预览文档',
      children: previewContent,
    },
  ];

  return (
    <div className="container">
      <Head>
        <title>{testReportTemplate.name} - 文档模板生成器</title>
      </Head>

      <div className="page-header">
        <Space>
          <Link href="/" passHref>
            <Button icon={<ArrowLeftOutlined />} type="link">
              返回首页
            </Button>
          </Link>
          <Title level={2} style={{ margin: 0 }}>
            {testReportTemplate.name}
          </Title>
        </Space>
        <Paragraph className="description">{testReportTemplate.description}</Paragraph>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={key => {
          if (key === 'preview') {
            // 切换到预览标签时，重新生成内容
            form
              .validateFields()
              .then(values => {
                const markdownContent = testReportTemplate.generateMarkdown(values);
                setGeneratedContent(markdownContent);
                setActiveTab(key);
              })
              .catch(() => {
                message.error('请填写必填项');
                // 验证失败时不切换标签
                return;
              });
          } else {
            // 直接切换到表单标签
            setActiveTab(key);
          }
        }}
        items={tabItems}
      />

      {/* 固定位置的按钮组 */}
      {activeTab === 'form' && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#fff',
            padding: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: '0 8px 8px 0',
            zIndex: 1000,
          }}
        >
          <Space direction="vertical">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                form
                  .validateFields()
                  .then(values => {
                    // 先生成文档内容再切换到预览页
                    const markdownContent = testReportTemplate.generateMarkdown(values);
                    setGeneratedContent(markdownContent);
                    setActiveTab('preview');
                  })
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
