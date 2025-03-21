// 提测文档模板定义

export interface TestReportTemplate {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  generateMarkdown: (values: Record<string, any>) => string;
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'radio' | 'checkbox' | 'group' | 'table';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: any;
  children?: TemplateField[];
  columns?: TemplateField[];
}

const testReportTemplate: TestReportTemplate = {
  id: 'test-report',
  name: '提测文档',
  description: '标准提测文档模板，包含版本、功能点、测试范围等',
  fields: [
    {
      id: 'projectName',
      name: 'projectName',
      type: 'text',
      label: '项目名称',
      placeholder: '请输入项目名称',
      required: true,
    },
    {
      id: 'documents',
      name: 'documents',
      type: 'group',
      label: '文档',
      children: [
        {
          id: 'prdDocument',
          name: 'prdDocument',
          type: 'text',
          label: 'PRD原型稿',
          placeholder: '请输入PRD文档链接',
          required: true,
        },
        {
          id: 'backendDocument',
          name: 'backendDocument',
          type: 'text',
          label: '后端技术文档',
          placeholder: '请输入后端技术文档链接（选填）',
          required: false,
        },
        {
          id: 'frontendDocument',
          name: 'frontendDocument',
          type: 'text',
          label: '前端技术文档',
          placeholder: '请输入前端技术文档链接（选填）',
          required: false,
        },
        {
          id: 'uiDocument',
          name: 'uiDocument',
          type: 'text',
          label: 'UI稿',
          placeholder: '请输入UI稿链接（选填）',
          required: false,
        },
        {
          id: 'smokeDoc',
          name: 'smokeDoc',
          type: 'text',
          label: '冒烟文档',
          placeholder: '请输入冒烟文档链接（选填）',
          required: false,
        },
      ],
    },
    {
      id: 'projects',
      name: 'projects',
      type: 'group',
      label: '项目',
      children: [
        {
          id: 'frontendProjects',
          name: 'frontendProjects',
          type: 'table',
          label: '前端项目',
          required: true,
          columns: [
            {
              id: 'repoUrl',
              name: 'repoUrl',
              type: 'text',
              label: '项目名',
              placeholder: '请输入前端项目名称',
              required: true,
            },
            {
              id: 'gitUrl',
              name: 'gitUrl',
              type: 'text',
              label: 'Git地址',
              placeholder: '请输入前端项目Git地址',
              required: true,
            },
            {
              id: 'jenkinsUrl',
              name: 'jenkinsUrl',
              type: 'text',
              label: 'Jenkins地址',
              placeholder: '请输入前端项目Jenkins地址',
              required: true,
            },
          ],
        },
        {
          id: 'backendProjects',
          name: 'backendProjects',
          type: 'table',
          label: '后端项目',
          required: true,
          columns: [
            {
              id: 'repoUrl',
              name: 'repoUrl',
              type: 'text',
              label: '项目名',
              placeholder: '请输入后端项目名称',
              required: true,
            },
            {
              id: 'gitUrl',
              name: 'gitUrl',
              type: 'text',
              label: 'Git地址',
              placeholder: '请输入后端项目Git地址',
              required: true,
            },
            {
              id: 'jenkinsUrl',
              name: 'jenkinsUrl',
              type: 'text',
              label: 'Jenkins地址',
              placeholder: '请输入后端项目Jenkins地址',
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'serverConfigs',
      name: 'serverConfigs',
      type: 'group',
      label: '服务端配置',
      children: [
        {
          id: 'apolloConfig',
          name: 'apolloConfig',
          type: 'textarea',
          label: 'Apollo配置',
          placeholder: '请输入Apollo配置代码段',
          required: false,
        },
        {
          id: 'databaseConfig',
          name: 'databaseConfig',
          type: 'textarea',
          label: '数据库配置',
          placeholder: '请输入数据库配置代码段',
          required: false,
        },
        {
          id: 'jobConfig',
          name: 'jobConfig',
          type: 'textarea',
          label: '定时脚本&消费队列',
          placeholder: '请输入定时脚本/消费队列代码段',
          required: false,
        },
        {
          id: 'customConfigs',
          name: 'customConfigs',
          type: 'table',
          label: '自定义配置',
          required: false,
          columns: [
            {
              id: 'name',
              name: 'name',
              type: 'text',
              label: '配置名称',
              placeholder: '请输入配置名称',
              required: true,
            },
            {
              id: 'code',
              name: 'code',
              type: 'textarea',
              label: '配置代码',
              placeholder: '请输入配置代码段',
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'developBranch',
      name: 'developBranch',
      type: 'text',
      label: '开发分支',
      placeholder: '如: feature/xxx',
      defaultValue: 'feature/',
      required: true,
    },
    {
      id: 'testBranch',
      name: 'testBranch',
      type: 'text',
      label: '测试分支',
      placeholder: '如: test/xxx',
      defaultValue: 'test/',
      required: true,
    },
    {
      id: 'projectMembers',
      name: 'projectMembers',
      type: 'group',
      label: '项目参与人员',
      children: [
        {
          id: 'productManager',
          name: 'productManager',
          type: 'text',
          label: '产品人员',
          placeholder: '产品人员姓名，多人用逗号分隔',
          required: true,
        },
        {
          id: 'frontendDeveloper',
          name: 'frontendDeveloper',
          type: 'text',
          label: '前端开发人员',
          placeholder: '前端开发人员姓名，多人用逗号分隔',
          required: true,
        },
        {
          id: 'backendDeveloper',
          name: 'backendDeveloper',
          type: 'text',
          label: '后端开发人员',
          placeholder: '后端开发人员姓名，多人用逗号分隔',
          required: true,
        },
        {
          id: 'tester',
          name: 'tester',
          type: 'text',
          label: '测试人员',
          placeholder: '测试人员姓名，多人用逗号分隔',
          required: true,
        },
      ],
    },
    {
      id: 'attention',
      name: 'attention',
      type: 'textarea',
      label: '注意事项',
      placeholder: '需要特别注意的地方',
      required: false,
    },
    {
      id: 'remark',
      name: 'remark',
      type: 'textarea',
      label: '备注',
      placeholder: '其他需要备注的信息',
      required: false,
    },
  ],
  generateMarkdown: (values: Record<string, any>): string => {
    const frontendProjectsTable =
      values.frontendProjects
        ?.map(
          (project: any) => `| ${project.repoUrl} | ${project.gitUrl} | ${project.jenkinsUrl} |`
        )
        .join('\n') || '';

    const backendProjectsTable =
      values.backendProjects
        ?.map(
          (project: any) => `| ${project.repoUrl} | ${project.gitUrl} | ${project.jenkinsUrl} |`
        )
        .join('\n') || '';

    const customConfigsTable =
      values.customConfigs
        ?.map((config: any) => `| ${config.name} | \`\`\`\n${config.code}\n\`\`\` |`)
        .join('\n') || '';

    return `# ${values.projectName} 提测文档

## 基本信息

- **项目名称**: ${values.projectName}
- **相关文档**:
  - **PRD原型稿**: ${values.prdDocument}
${values.backendDocument ? `  - **后端技术文档**: ${values.backendDocument}` : ''}
${values.frontendDocument ? `  - **前端技术文档**: ${values.frontendDocument}` : ''}
${values.uiDocument ? `  - **UI稿**: ${values.uiDocument}` : ''}
${values.smokeDoc ? `  - **冒烟文档**: ${values.smokeDoc}` : ''}

## 项目信息

### 前端项目
| 项目名 | Git地址 | Jenkins地址 |
|---------|---------|-------------|
${frontendProjectsTable}

### 后端项目
| 项目名 | Git地址 | Jenkins地址 |
|---------|---------|-------------|
${backendProjectsTable}

## 服务端配置

${
  values.apolloConfig
    ? `### Apollo配置
\`\`\`
${values.apolloConfig}
\`\`\`
`
    : ''
}

${
  values.databaseConfig
    ? `### 数据库配置
\`\`\`
${values.databaseConfig}
\`\`\`
`
    : ''
}

${
  values.jobConfig
    ? `### 定时脚本&消费队列
\`\`\`
${values.jobConfig}
\`\`\`
`
    : ''
}

${
  customConfigsTable
    ? `### 自定义配置
| 配置名称 | 配置代码 |
|---------|---------|
${customConfigsTable}`
    : ''
}

- **开发分支**: ${values.developBranch}
- **测试分支**: ${values.testBranch}

## 项目参与人员

- **产品人员**: ${values.productManager}
- **前端开发**: ${values.frontendDeveloper}
- **后端开发**: ${values.backendDeveloper}
- **测试人员**: ${values.tester}

## 注意事项

${values.attention || '无特别注意事项'}

## 备注

${values.remark || '无'}
`;
  },
};

export default testReportTemplate;
