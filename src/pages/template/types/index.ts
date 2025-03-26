export type TemplateFormValues = Record<string, any>;

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  options?: Array<{
    label: string;
    value: string | number;
  }>;
  children?: TemplateField[];
  columns?: TemplateField[];
}
