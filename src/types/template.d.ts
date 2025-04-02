export interface TemplateField {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
  children?: TemplateField[];
  columns?: Array<{
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
  }>;
  roles?: string[];
}

export interface BaseTemplateValues {
  title: string;
  [key: string]: any;
}

export interface Template<T extends BaseTemplateValues = BaseTemplateValues> {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  generateMarkdown: (values: T) => string;
  generateHtml: (values: T) => string;
}

export type TemplateFormValues = BaseTemplateValues;
