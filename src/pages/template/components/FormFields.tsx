import { FileTextOutlined } from '@ant-design/icons';
import { Checkbox, Divider, Form, Input, Radio, Select, Space } from 'antd';
import { FormInstance, Rule } from 'antd/es/form';
import React from 'react';
import { RoleType } from '../../../components/RoleSelector';
import { Template, TemplateField, TemplateFormValues } from '../../../types/template';
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
  selectedRoles?: RoleType[];
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
  selectedRoles = ['pm', 'frontend', 'backend'],
}) => {
  // 安全检查
  if (!fields || !form || !template) {
    return null;
  }

  const fieldRenderers: Record<string, FieldRenderer> = {
    text: (field: TemplateField, fieldName: string, rules: Rule[] | undefined) => (
      <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules} preserve={true}>
        <Input placeholder={field.placeholder} />
      </Form.Item>
    ),

    textarea: (field: TemplateField, fieldName: string, rules: Rule[] | undefined) => (
      <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules} preserve={true}>
        <TextArea placeholder={field.placeholder} autoSize={{ minRows: 3, maxRows: 6 }} />
      </Form.Item>
    ),

    select: (field: TemplateField, fieldName: string, rules: Rule[] | undefined) => (
      <Form.Item key={field.id} name={fieldName} label={field.label} rules={rules} preserve={true}>
        <Select placeholder={field.placeholder}>
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
            selectedRoles={selectedRoles}
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

  // 根据角色过滤字段
  const filteredFields = fields.filter(field => {
    // 如果字段没有指定角色，对所有角色可见
    if (!field.roles) return true;

    // 检查当前选择的角色是否与字段所需角色有交集
    return selectedRoles.some(role => field.roles?.includes(role));
  });

  return filteredFields.map(field => {
    const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name;
    const rules = field.required
      ? [{ required: true, message: `请输入${field.label}` }]
      : undefined;

    const renderer = fieldRenderers[field.type as keyof typeof fieldRenderers];
    return renderer ? renderer(field, fieldName, rules) : null;
  });
};

export default FormFields;
