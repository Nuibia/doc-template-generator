import { Header } from '@/components';
import { useTemplateForm } from '@/hooks/useTemplateForm';
import releasePlanTemplate from '@/templates/releasePlan';
import testReportTemplate from '@/templates/testReport';
import weeklyReportTemplate from '@/templates/weeklyReport';
import { Card, Form, Tabs, message } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import FloatingButtons from './components/FloatingButtons';
import FormFields from './components/FormFields';
import PreviewContent from './components/PreviewContent';
import styles from './index.module.less';

// 模板映射
const templateMap = {
  'test-report': testReportTemplate,
  'release-plan': releasePlanTemplate,
  'weekly-report': weeklyReportTemplate,
};

const TemplatePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const templateId = typeof id === 'string' ? id : 'test-report';
  const template = templateMap[templateId as keyof typeof templateMap] || testReportTemplate;

  const {
    form,
    previewMode,
    setPreviewMode,
    generatedContent,
    setGeneratedContent,
    generatedHtmlContent,
    setGeneratedHtmlContent,
    activeTab,
    setActiveTab,
    initialFormData,
    loadSavedData,
    saveToLocalStorage,
    handleReset,
    handleFormValuesChange,
  } = useTemplateForm(template);

  React.useEffect(() => {
    if (router.isReady) {
      loadSavedData();
    }
  }, [loadSavedData, router.isReady]);

  const handlePreview = () => {
    form
      .validateFields()
      .then(values => {
        const markdownContent = template.generateMarkdown(values);
        const htmlContent = template.generateHtml(values);
        setGeneratedContent(markdownContent);
        setGeneratedHtmlContent(htmlContent);
        setActiveTab('preview');
      })
      .catch(() => message.error('请填写必填项'));
  };

  const copyToClipboard = () => {
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
    a.download = `${template.name}-${new Date().toLocaleDateString()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToDoc = () => {
    const docContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${template.name}-${new Date().toLocaleDateString()}</title>
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

    const blob = new Blob([docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}-${new Date().toLocaleDateString()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('已导出Word文档');
  };

  const formContent = (
    <Card variant="borderless">
      <Form
        form={form}
        layout="vertical"
        onFinish={handlePreview}
        onValuesChange={handleFormValuesChange}
        initialValues={initialFormData}
      >
        <FormFields
          fields={template.fields}
          form={form}
          template={template}
          onValuesChange={(_, allValues) => handleFormValuesChange(_, allValues)}
          saveToLocalStorage={saveToLocalStorage}
          setGeneratedContent={setGeneratedContent}
          setGeneratedHtmlContent={setGeneratedHtmlContent}
        />
      </Form>
    </Card>
  );

  const tabItems = [
    {
      key: 'form',
      label: '表单填写',
      children: formContent,
    },
    {
      key: 'preview',
      label: '预览文档',
      children: (
        <PreviewContent
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          generatedContent={generatedContent}
          generatedHtmlContent={generatedHtmlContent}
          onCopy={copyToClipboard}
          onExportMarkdown={exportToMarkdown}
          onExportDoc={exportToDoc}
        />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>{`${template.name} - 文档模板生成器`}</title>
      </Head>

      <Header
        title={template.name}
        description={template.description}
        showBackButton={true}
        backButtonTo="/"
      />

      <Tabs
        activeKey={activeTab}
        onChange={key => {
          if (key === 'preview') {
            form
              .validateFields()
              .then(values => {
                const markdownContent = template.generateMarkdown(values);
                const htmlContent = template.generateHtml(values);
                setGeneratedContent(markdownContent);
                setGeneratedHtmlContent(htmlContent);
                setActiveTab(key);
              })
              .catch(() => {
                message.error('请填写必填项');
                return;
              });
          } else {
            setActiveTab(key);
          }
        }}
        items={tabItems}
      />

      {activeTab === 'form' && <FloatingButtons onPreview={handlePreview} onReset={handleReset} />}
    </div>
  );
};

export default TemplatePage;
