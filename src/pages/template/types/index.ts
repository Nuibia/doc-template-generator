export type TemplateFormValues = Record<string, unknown>;

export interface TemplateFieldOption {
  label: string;
  value: string | number;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  defaultValue?: unknown;
  required?: boolean;
  options?: TemplateFieldOption[];
  children?: TemplateField[];
  columns?: TemplateField[];
}

export interface FormInstance<T = TemplateFormValues> {
  getFieldValue: (name: string) => unknown;
  getFieldsValue: (nameList?: string[]) => T;
  resetFields: (fields?: string[]) => void;
  setFieldsValue: (values: Partial<T>) => void;
  validateFields: () => Promise<T>;
}

export interface Template {
  name: string;
  description: string;
  fields: TemplateField[];
  generateMarkdown: (values: TemplateFormValues) => string;
  generateHtml: (values: TemplateFormValues) => string;
}

// 添加默认导出，解决Next.js构建优化错误
const DefaultComponent = () => null;
export default DefaultComponent;
