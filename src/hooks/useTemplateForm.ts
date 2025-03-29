import { Form, message } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { Template, TemplateFormValues } from '../types/template';

export const useTemplateForm = (template: Template) => {
  const [form] = Form.useForm<TemplateFormValues>();
  const [previewMode, setPreviewMode] = useState<'rich' | 'markdown'>('rich');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [generatedHtmlContent, setGeneratedHtmlContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('form');
  const [initialFormData, setInitialFormData] = useState<TemplateFormValues>({ title: '' });
  const debounceTimerRef = useRef<number | null>(null);

  const loadSavedData = useCallback(() => {
    const templateId = template.name.toLowerCase().replace(/\s+/g, '-');
    const savedData = localStorage.getItem(`${templateId}_${previewMode}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as TemplateFormValues;
        setInitialFormData(parsedData);
        setTimeout(() => {
          form.resetFields();
          form.setFieldsValue(parsedData);
          const markdownContent = template.generateMarkdown(parsedData);
          const htmlContent = template.generateHtml(parsedData);
          setGeneratedContent(markdownContent);
          setGeneratedHtmlContent(htmlContent);
        }, 100);
      } catch (error) {
        console.error('加载保存的数据失败:', error);
      }
    }
  }, [form, template, previewMode]);

  const saveToLocalStorage = useCallback(
    (values: TemplateFormValues) => {
      try {
        const templateId = template.name.toLowerCase().replace(/\s+/g, '-');
        localStorage.setItem(`${templateId}_${previewMode}`, JSON.stringify(values));
      } catch (error) {
        console.error('保存数据失败:', error);
      }
    },
    [template, previewMode]
  );

  const handleReset = useCallback(() => {
    setInitialFormData({ title: '' });
    form.resetFields();
    const templateId = template.name.toLowerCase().replace(/\s+/g, '-');
    localStorage.removeItem(`${templateId}_rich`);
    localStorage.removeItem(`${templateId}_markdown`);
    setGeneratedContent('');
    setGeneratedHtmlContent('');
    message.success('表单已重置');
  }, [form, template]);

  const handleFormValuesChange = useCallback(
    (changedValues: Partial<TemplateFormValues>, allValues: TemplateFormValues) => {
      if (debounceTimerRef.current !== null) {
        window.clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(() => {
        const markdownContent = template.generateMarkdown(allValues);
        const htmlContent = template.generateHtml(allValues);
        setGeneratedContent(markdownContent);
        setGeneratedHtmlContent(htmlContent);
        saveToLocalStorage(allValues);
        debounceTimerRef.current = null;
      }, 500);
    },
    [saveToLocalStorage, template]
  );

  return {
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
  };
};
