import {
  ArrowLeftOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExportOutlined,
  EyeOutlined,
  FileTextOutlined,
  FileWordOutlined,
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
import React, { useCallback, useRef, useState } from 'react';
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
  const [generatedHtmlContent, setGeneratedHtmlContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('form');
  // 初始表单数据
  const [initialFormData, setInitialFormData] = useState<TemplateFormValues>({});

  // 创建一个防抖timer引用
  const debounceTimerRef = useRef<number | null>(null);

  // 从 localStorage 加载保存的数据
  const loadSavedData = useCallback(() => {
    const savedData = localStorage.getItem(`${testReportTemplate.id}FormData`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('加载保存的数据:', parsedData);

        // 设置初始表单数据
        setInitialFormData(parsedData);

        // 使用setTimeout确保表单已完全渲染
        setTimeout(() => {
          // 重置表单并设置新值
          form.resetFields();
          form.setFieldsValue(parsedData);

          // 加载数据后生成内容
          const markdownContent = testReportTemplate.generateMarkdown(parsedData);
          const htmlContent = testReportTemplate.generateHtml(parsedData);
          setGeneratedContent(markdownContent);
          setGeneratedHtmlContent(htmlContent);
        }, 100);
      } catch (error) {
        console.error('加载保存的数据失败:', error);
      }
    }
  }, [form]);

  // 保存数据到 localStorage
  const saveToLocalStorage = useCallback((values: TemplateFormValues) => {
    try {
      console.log('保存数据:', values);
      localStorage.setItem(`${testReportTemplate.id}FormData`, JSON.stringify(values));
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  }, []);

  // 重置表单
  const handleReset = useCallback(() => {
    // 确认提示
    Modal.confirm({
      title: '确认重置表单',
      content: '重置将清空所有已填写的内容，确定要继续吗？',
      okText: '确定重置',
      cancelText: '取消',
      onOk: () => {
        // 清空初始数据
        setInitialFormData({});
        // 重置表单
        form.resetFields();
        // 清除本地存储
        localStorage.removeItem(`${testReportTemplate.id}FormData`);
        // 清空生成内容
        setGeneratedContent('');
        setGeneratedHtmlContent('');
        // 提示用户
        message.success('表单已重置');
      },
    });
  }, [form]);

  // 使用防抖处理表单值变化，避免频繁更新和数据竞争
  const handleFormValuesChange = useCallback(
    (changedValues: any, allValues: TemplateFormValues) => {
      // 如果已经存在计时器，清除它
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }

      // 输出调试信息
      console.log('表单值变化:', changedValues);

      // 设置新的计时器，延迟处理变更
      debounceTimerRef.current = window.setTimeout(() => {
        console.log('处理表单值变化(防抖后):', allValues);

        // 生成内容并保存
        const markdownContent = testReportTemplate.generateMarkdown(allValues);
        const htmlContent = testReportTemplate.generateHtml(allValues);
        setGeneratedContent(markdownContent);
        setGeneratedHtmlContent(htmlContent);
        saveToLocalStorage(allValues);

        // 清除计时器引用
        debounceTimerRef.current = null;
      }, 500); // 500ms防抖延迟
    },
    [saveToLocalStorage]
  );

  // 表单提交处理
  const handleFormSubmit = useCallback(
    (values: TemplateFormValues) => {
      // 确保数据已正确保存
      saveToLocalStorage(values);

      // 重新生成内容 - 使用当前表单值而不是外部状态
      form.validateFields().then(currentValues => {
        console.log('提交表单:', currentValues);
        const markdownContent = testReportTemplate.generateMarkdown(currentValues);
        const htmlContent = testReportTemplate.generateHtml(currentValues);
        setGeneratedContent(markdownContent);
        setGeneratedHtmlContent(htmlContent);
        // 切换到预览标签
        setActiveTab('preview');
      });
    },
    [form, saveToLocalStorage]
  );

  // 组件加载时加载保存的数据
  React.useEffect(() => {
    loadSavedData();

    // 组件卸载时清除可能存在的计时器
    return () => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [loadSavedData]);

  const copyToClipboard = () => {
    // 根据当前预览模式决定复制的内容
    const contentToCopy = previewMode === 'rich' ? generatedHtmlContent : generatedContent;

    navigator.clipboard
      .writeText(contentToCopy)
      .then(() => {
        message.success(`${previewMode === 'rich' ? '富文本' : 'Markdown'}内容已复制到剪贴板`);
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

  // 导出为DOC文件
  const exportToDoc = () => {
    // 创建一个完整的HTML文档
    let docContent = '';

    if (previewMode === 'rich') {
      // 使用富文本内容
      docContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${form.getFieldValue('projectName')}-提测文档</title>
<style>
  body { font-family: Arial, sans-serif; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px; }
  th { background-color: #f2f2f2; }
  h1 { font-size: 24px; }
  h2 { font-size: 20px; }
  h3 { font-size: 16px; }
  pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; }
</style>
</head>
<body>
${generatedHtmlContent}
</body>
</html>`;
    } else {
      // 在Markdown模式下，使用已转换好的HTML内容而不是原始Markdown
      docContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${form.getFieldValue('projectName')}-提测文档</title>
<style>
  body { font-family: Arial, sans-serif; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px; }
  th { background-color: #f2f2f2; }
  h1 { font-size: 24px; }
  h2 { font-size: 20px; }
  h3 { font-size: 16px; }
  pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; }
</style>
</head>
<body>
${generatedHtmlContent}
</body>
</html>`;
    }

    // 创建Blob并下载
    const blob = new Blob([docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.getFieldValue('projectName')}-提测文档.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    message.success('已导出Word文档');
  };

  // 动态渲染表单字段
  const renderFormFields = (fields: TemplateField[], parentPath = '') => {
    // 字段渲染策略，使用策略模式替代switch-case
    const fieldRenderers = {
      text: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item
          key={field.id}
          name={fieldName}
          label={field.label}
          rules={rules}
          preserve={true}
        >
          <Input placeholder={field.placeholder} defaultValue={field.defaultValue} />
        </Form.Item>
      ),

      textarea: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item
          key={field.id}
          name={fieldName}
          label={field.label}
          rules={rules}
          preserve={true}
        >
          <TextArea
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
      ),

      date: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item
          key={field.id}
          name={fieldName}
          label={field.label}
          rules={rules}
          preserve={true}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>
      ),

      select: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item
          key={field.id}
          name={fieldName}
          label={field.label}
          rules={rules}
          preserve={true}
        >
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
          preserve={true}
        >
          <Checkbox>{field.label}</Checkbox>
        </Form.Item>
      ),

      radio: (field: TemplateField, fieldName: string, rules: any) => (
        <Form.Item
          key={field.id}
          name={fieldName}
          label={field.label}
          rules={rules}
          preserve={true}
        >
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
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    style={{ marginBottom: 16 }}
                    title={`${field.label} #${name + 1}`}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          // 先保存当前表单值，用于调试
                          console.log(
                            `删除项目前：${fieldName}[${name}]`,
                            form.getFieldValue([fieldName, name])
                          );

                          // 执行删除
                          remove(name);

                          // 删除后用setTimeout刷新表单，确保UI正确更新
                          setTimeout(() => {
                            console.log(`删除项目后，表单值:`, form.getFieldsValue());

                            // 更新表单内容生成
                            const allValues = form.getFieldsValue();
                            const markdownContent = testReportTemplate.generateMarkdown(allValues);
                            const htmlContent = testReportTemplate.generateHtml(allValues);
                            setGeneratedContent(markdownContent);
                            setGeneratedHtmlContent(htmlContent);
                            saveToLocalStorage(allValues);
                          }, 100);
                        }}
                      >
                        删除
                      </Button>
                    }
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {field.columns?.map(column => {
                        // 构建表单项名称路径 - 使用数组而不是字符串
                        const fieldPath = [name, column.name];

                        // 生成验证规则
                        const columnRules = column.required
                          ? [{ required: true, message: `请输入${column.label}` }]
                          : undefined;

                        // 根据列类型渲染不同的表单控件
                        const renderControl = () => {
                          if (column.type === 'textarea') {
                            return (
                              <TextArea
                                placeholder={column.placeholder}
                                autoSize={{ minRows: 3, maxRows: 6 }}
                              />
                            );
                          }
                          return <Input placeholder={column.placeholder} />;
                        };

                        return (
                          <Form.Item
                            key={`${key}-${column.id}`}
                            {...restField}
                            name={fieldPath}
                            label={column.label}
                            rules={columnRules}
                          >
                            {renderControl()}
                          </Form.Item>
                        );
                      })}
                    </Space>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={() => {
                    // 先保存当前表单值，用于调试
                    console.log(`添加项目前：${fieldName}`, form.getFieldValue(fieldName));

                    // 添加新项
                    add({});

                    // 添加后刷新表单，确保UI正确更新
                    setTimeout(() => {
                      console.log(`添加项目后，表单值:`, form.getFieldsValue());

                      // 更新表单内容生成
                      const allValues = form.getFieldsValue();
                      const markdownContent = testReportTemplate.generateMarkdown(allValues);
                      const htmlContent = testReportTemplate.generateHtml(allValues);
                      setGeneratedContent(markdownContent);
                      setGeneratedHtmlContent(htmlContent);
                      saveToLocalStorage(allValues);
                    }, 100);
                  }}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 16 }}
                >
                  添加{field.label}
                </Button>
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
        initialValues={initialFormData}
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
          {previewMode === 'markdown' && (
            <>
              <Button icon={<CopyOutlined />} onClick={copyToClipboard}>
                复制到剪贴板
              </Button>
              <Button type="primary" icon={<ExportOutlined />} onClick={exportToMarkdown}>
                导出Markdown
              </Button>
            </>
          )}
          {previewMode === 'rich' && (
            <Button type="primary" icon={<FileWordOutlined />} onClick={exportToDoc}>
              导出Word
            </Button>
          )}
        </Space>
      </div>

      <div className="preview-container">
        {previewMode === 'rich' ? (
          <div
            className="html-content"
            dangerouslySetInnerHTML={{ __html: generatedHtmlContent }}
          />
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
                const htmlContent = testReportTemplate.generateHtml(values);
                setGeneratedContent(markdownContent);
                setGeneratedHtmlContent(htmlContent);
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
                    console.log('values', values);
                    // 先生成文档内容再切换到预览页
                    const markdownContent = testReportTemplate.generateMarkdown(values);
                    const htmlContent = testReportTemplate.generateHtml(values);
                    setGeneratedContent(markdownContent);
                    setGeneratedHtmlContent(htmlContent);
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
