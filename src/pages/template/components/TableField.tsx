import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import type { FormListFieldData, FormListOperation } from 'antd/es/form/FormList';
import React from 'react';
import { Template, TemplateField, TemplateFormValues } from '../../../types/template';

const { TextArea } = Input;

interface TableFieldProps {
  field: TemplateField;
  fieldName: string;
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

const TableField: React.FC<TableFieldProps> = ({
  field,
  fieldName,
  form,
  template,
  onValuesChange,
  saveToLocalStorage,
  setGeneratedContent,
  setGeneratedHtmlContent,
}) => {
  // 安全检查
  if (!field || !fieldName || !form || !template) {
    return null;
  }

  return (
    <React.Fragment>
      <Divider orientation="left">{field.label}</Divider>
      <Form.List name={fieldName}>
        {(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
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
                      remove(name);
                      setTimeout(() => {
                        const allValues = form.getFieldsValue();
                        const markdownContent = template.generateMarkdown(allValues);
                        const htmlContent = template.generateHtml(allValues);
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
                    const fieldPath = [name, column.name] as [number, string];
                    const columnRules = column.required
                      ? [{ required: true, message: `请输入${column.label}` }]
                      : undefined;

                    return (
                      <Form.Item
                        key={`${key}-${column.id}`}
                        {...restField}
                        name={fieldPath}
                        label={column.label}
                        rules={columnRules}
                      >
                        {column.type === 'textarea' ? (
                          <TextArea
                            placeholder={column.placeholder}
                            autoSize={{ minRows: 3, maxRows: 6 }}
                          />
                        ) : (
                          <Input placeholder={column.placeholder} />
                        )}
                      </Form.Item>
                    );
                  })}
                </Space>
              </Card>
            ))}

            <Button
              type="dashed"
              onClick={() => {
                add({});
                setTimeout(() => {
                  const allValues = form.getFieldsValue();
                  const markdownContent = template.generateMarkdown(allValues);
                  const htmlContent = template.generateHtml(allValues);
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
  );
};

export default TableField;
