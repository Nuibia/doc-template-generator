import { FileTextOutlined } from '@ant-design/icons';
import { Checkbox, Divider, Form, Input, Radio, Select, Space } from 'antd';
import { Rule } from 'antd/es/form';
import React from 'react';
import { FormInstance, Template, TemplateField, TemplateFormValues } from '../types';
import TableField from './TableField';

const { TextArea } = Input;
const { Option } = Select;

interface FormFieldsProps {
  fields: TemplateField[];
  parentPath?: string;
  form: FormInstance;
  template: Template;
  onValuesChange: (
    changedValues: Partial<TemplateFormValues>,
    allValues: TemplateFormValues
  ) => void;
  saveToLocalStorage: (values: TemplateFormValues) => void;
  setGeneratedContent: (content: string) => void;
  setGeneratedHtmlContent: (content: string) => void;
}

type FieldRenderer = (
  field: TemplateField,
  fieldName: string,
  rules: Rule[] | undefined
) => React.ReactNode;

const FormFields: React.FC<FormFieldsProps> = ({
  fields = [],
  parentPath = '',
  form,
  template,
  onValuesChange,
  saveToLocalStorage,
  setGeneratedContent,
  setGeneratedHtmlContent,
}) => {
  // 安全检查
  if (!fields || !form || !template) {
    return null;
  }

  const fieldRenderers: Record<string, FieldRenderer> = {
    text: (field: TemplateField, fieldName: string, rules: Rule[] | undefined) => (
      <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules} preserve={true}>
        <Input placeholder={field.placeholder} defaultValue={field.defaultValue as string} />
      </Form.Item>
    ),

    textarea: (field: TemplateField, fieldName: string, rules: Rule[] | undefined) => (
      <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules} preserve={true}>
        <TextArea
          placeholder={field.placeholder}
          defaultValue={field.defaultValue as string}
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>
    ),

    select: (field: TemplateField, fieldName: string, rules: Rule[] | undefined) => (
      <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules} preserve={true}>
        <Select
          placeholder={field.placeholder}
          defaultValue={field.defaultValue as string | number}
        >
          {field.options?.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    ),

    checkbox: (field: TemplateField, fieldName: string, rules: Rule[] | undefined) => (
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

    radio: (field: TemplateField, fieldName: string, rules: Rule[] | undefined) => (
      <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules} preserve={true}>
        <Radio.Group>
          {field.options?.map(option => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    ),

    group: (field: TemplateField, fieldName: string) => (
      <React.Fragment key={field.id}>
        <Divider orientation="left">
          <Space>
            <FileTextOutlined />
            <span>{field.label}</span>
          </Space>
        </Divider>
        {field.children && (
          <FormFields
            fields={field.children}
            parentPath={fieldName}
            form={form}
            template={template}
            onValuesChange={onValuesChange}
            saveToLocalStorage={saveToLocalStorage}
            setGeneratedContent={setGeneratedContent}
            setGeneratedHtmlContent={setGeneratedHtmlContent}
          />
        )}
      </React.Fragment>
    ),

    table: (field: TemplateField, fieldName: string) => (
      <TableField
        key={field.id}
        field={field}
        fieldName={fieldName}
        form={form}
        template={template}
        onValuesChange={onValuesChange}
        saveToLocalStorage={saveToLocalStorage}
        setGeneratedContent={setGeneratedContent}
        setGeneratedHtmlContent={setGeneratedHtmlContent}
      />
    ),
  };

  return fields.map(field => {
    const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name;
    const rules = field.required
      ? [{ required: true, message: `请输入${field.label}` }]
      : undefined;

    const renderer = fieldRenderers[field.type as keyof typeof fieldRenderers];
    return renderer ? renderer(field, fieldName, rules) : null;
  });
};

export default FormFields;
