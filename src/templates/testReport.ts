// 提测文档模板定义
import { RoleType } from '@/components/RoleSelector';

export interface TestReportTemplate {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  generateMarkdown: (values: Record<string, any>, roles?: RoleType[]) => string;
  generateHtml: (values: Record<string, any>, roles?: RoleType[]) => string;
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'group' | 'table';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: any;
  children?: TemplateField[];
  columns?: TemplateField[];
  roles?: RoleType[]; // 哪些角色可以查看此字段
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
      roles: ['pm'],
    },
    {
      id: 'documents',
      name: 'documents',
      type: 'group',
      label: '文档',
      roles: ['pm'],
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
          roles: ['frontend'],
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
              id: 'repoBranch',
              name: 'repoBranch',
              type: 'text',
              label: '分支',
              placeholder: '请输入项目分支，如: master',
              required: false,
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
          roles: ['backend'],
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
              id: 'repoBranch',
              name: 'repoBranch',
              type: 'text',
              label: '分支',
              placeholder: '请输入项目分支，如: master',
              required: false,
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
      roles: ['backend'],
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
      placeholder: '请输入开发分支，如: feature/xxx',
      defaultValue: '',
      required: false,
    },
    {
      id: 'testBranch',
      name: 'testBranch',
      type: 'text',
      label: '测试分支',
      placeholder: '请输入测试分支，如: test/xxx',
      defaultValue: '',
      required: false,
    },
    {
      id: 'projectMembers',
      name: 'projectMembers',
      type: 'group',
      label: '项目参与人员',
      roles: ['pm'],
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
      id: 'remark',
      name: 'remark',
      type: 'textarea',
      label: '备注',
      placeholder: '其他需要备注的信息',
      required: false,
    },
  ],
  generateMarkdown: (values: Record<string, any>, roles?: RoleType[]): string => {
    // 如果未指定角色或包含PM角色，生成完整文档
    const showAll = !roles || roles.includes('pm');
    const showFrontend = showAll || (roles && roles.includes('frontend'));
    const showBackend = showAll || (roles && roles.includes('backend'));

    // 处理前端项目
    let frontendProjects = [];
    if (Array.isArray(values.projects?.frontendProjects)) {
      frontendProjects = values.projects.frontendProjects;
    } else if (Array.isArray(values['projects.frontendProjects'])) {
      frontendProjects = values['projects.frontendProjects'];
    }

    // 处理后端项目
    let backendProjects = [];
    if (Array.isArray(values.projects?.backendProjects)) {
      backendProjects = values.projects.backendProjects;
    } else if (Array.isArray(values['projects.backendProjects'])) {
      backendProjects = values['projects.backendProjects'];
    }

    // 处理自定义配置
    let customConfigs = [];
    if (Array.isArray(values.serverConfigs?.customConfigs)) {
      customConfigs = values.serverConfigs.customConfigs;
    } else if (Array.isArray(values['serverConfigs.customConfigs'])) {
      customConfigs = values['serverConfigs.customConfigs'];
    }

    // 前端项目表格
    let frontendTable = '';
    if (showFrontend && frontendProjects.length > 0) {
      frontendTable = `
| 项目名 | Git地址 | 分支 | Jenkins地址 |
| --- | --- | --- | --- |${frontendProjects
        .map(
          p => `
| ${p.repoUrl || '-'} | ${p.gitUrl || '-'} | ${p.repoBranch || '-'} | ${p.jenkinsUrl || '-'} |`
        )
        .join('')}`;
    }

    // 后端项目表格
    let backendTable = '';
    if (showBackend && backendProjects.length > 0) {
      backendTable = `
| 项目名 | Git地址 | 分支 | Jenkins地址 |
| --- | --- | --- | --- |${backendProjects
        .map(
          p => `
| ${p.repoUrl || '-'} | ${p.gitUrl || '-'} | ${p.repoBranch || '-'} | ${p.jenkinsUrl || '-'} |`
        )
        .join('')}`;
    }

    // 自定义配置（使用Markdown格式而非表格）
    const customConfigsMarkdown = showBackend
      ? customConfigs
          .map(c => {
            return `
### ${c.name || ''}
\`\`\`
${c.code || ''}
\`\`\`
`;
          })
          .join('\n')
      : '';

    let content = '';

    // 基本信息部分 - 如果是PM或包含PM角色才显示
    if (showAll) {
      content += `# ${values.projectName} 提测文档

## 基本信息

- **项目名称**: ${values.projectName}
- **相关文档**:
- **PRD原型稿**: ${values['documents.prdDocument'] || ''}
${values['documents.backendDocument'] ? `  - **后端技术文档**: ${values['documents.backendDocument']}` : ''}
${values['documents.frontendDocument'] ? `  - **前端技术文档**: ${values['documents.frontendDocument']}` : ''}
${values['documents.uiDocument'] ? `  - **UI稿**: ${values['documents.uiDocument']}` : ''}
${values['documents.smokeDoc'] ? `  - **冒烟文档**: ${values['documents.smokeDoc']}` : ''}

`;
    } else if (showFrontend) {
      content += `# 前端项目信息

`;
    } else if (showBackend) {
      content += `# 后端项目信息

`;
    }

    // 项目信息部分
    if (showFrontend || showBackend) {
      content += `## 项目信息\n\n`;
      if (showFrontend) content += `### 前端项目${frontendTable}\n\n`;
      if (showBackend) content += `### 后端项目${backendTable}\n\n`;
    }

    // 服务端配置部分 - 仅当显示后端内容时才显示
    if (showBackend) {
      content += `## 服务端配置\n\n`;

      if (values['serverConfigs.apolloConfig']) {
        content += `### Apollo配置
\`\`\`
${values['serverConfigs.apolloConfig']}
\`\`\`
\n`;
      }

      if (values['serverConfigs.databaseConfig']) {
        content += `### 数据库配置
\`\`\`
${values['serverConfigs.databaseConfig']}
\`\`\`
\n`;
      }

      if (values['serverConfigs.jobConfig']) {
        content += `### 定时脚本&消费队列
\`\`\`
${values['serverConfigs.jobConfig']}
\`\`\`
\n`;
      }

      if (customConfigs.length > 0) {
        content += `### 自定义配置${customConfigsMarkdown}\n`;
      }
    }

    // 开发分支和测试分支 - 对所有角色都显示
    if (values.developBranch || values.testBranch) {
      content += `## 开发分支与测试分支\n\n`;
      if (values.developBranch) content += `- **开发分支**: ${values.developBranch}\n`;
      if (values.testBranch) content += `- **测试分支**: ${values.testBranch}\n\n`;
    }

    // 项目参与人员 - 仅PM角色显示
    if (showAll) {
      content += `## 项目参与人员

- **产品人员**: ${values['projectMembers.productManager'] || ''}
- **前端开发**: ${values['projectMembers.frontendDeveloper'] || ''}
- **后端开发**: ${values['projectMembers.backendDeveloper'] || ''}
- **测试人员**: ${values['projectMembers.tester'] || ''}

`;
    }

    // 备注 - 仅PM角色显示
    if (showAll) {
      content += `
## 备注

${values.remark || '无'}`;
    }

    return content;
  },

  generateHtml: (values: Record<string, any>, roles?: RoleType[]): string => {
    // 如果未指定角色或包含PM角色，生成完整文档
    const showAll = !roles || roles.includes('pm');
    const showFrontend = showAll || (roles && roles.includes('frontend'));
    const showBackend = showAll || (roles && roles.includes('backend'));

    // 处理前端项目
    let frontendProjects = [];
    if (Array.isArray(values.projects?.frontendProjects)) {
      frontendProjects = values.projects.frontendProjects;
    } else if (Array.isArray(values['projects.frontendProjects'])) {
      frontendProjects = values['projects.frontendProjects'];
    }

    // 处理后端项目
    let backendProjects = [];
    if (Array.isArray(values.projects?.backendProjects)) {
      backendProjects = values.projects.backendProjects;
    } else if (Array.isArray(values['projects.backendProjects'])) {
      backendProjects = values['projects.backendProjects'];
    }

    // 处理自定义配置
    let customConfigs = [];
    if (Array.isArray(values.serverConfigs?.customConfigs)) {
      customConfigs = values.serverConfigs.customConfigs;
    } else if (Array.isArray(values['serverConfigs.customConfigs'])) {
      customConfigs = values['serverConfigs.customConfigs'];
    }

    // 前端项目表格
    let frontendTable = '';
    if (showFrontend && frontendProjects.length > 0) {
      frontendTable = `
<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>项目名</th>
      <th>Git地址</th>
      <th>分支</th>
      <th>Jenkins地址</th>
    </tr>
  </thead>
  <tbody>
    ${frontendProjects
      .map(
        p => `
    <tr>
      <td>${p.repoUrl || ''}</td>
      <td>${p.gitUrl || ''}</td>
      <td>${p.repoBranch || ''}</td>
      <td>${p.jenkinsUrl || ''}</td>
    </tr>`
      )
      .join('')}
  </tbody>
</table>
`;
    }

    // 后端项目表格
    let backendTable = '';
    if (showBackend && backendProjects.length > 0) {
      backendTable = `
<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>项目名</th>
      <th>Git地址</th>
      <th>分支</th>
      <th>Jenkins地址</th>
    </tr>
  </thead>
  <tbody>
    ${backendProjects
      .map(
        p => `
    <tr>
      <td>${p.repoUrl || ''}</td>
      <td>${p.gitUrl || ''}</td>
      <td>${p.repoBranch || ''}</td>
      <td>${p.jenkinsUrl || ''}</td>
    </tr>`
      )
      .join('')}
  </tbody>
</table>
`;
    }

    // 自定义配置
    const customConfigsHtml = showBackend
      ? customConfigs
          .map(c => {
            return `
<h3>${c.name || ''}</h3>
<pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;"><code>${c.code || ''}</code></pre>
`;
          })
          .join('')
      : '';

    let content = '';

    // 标题和基本信息 - 根据角色决定显示内容
    if (showAll) {
      content += `
<h1>${values.projectName} 提测文档</h1>

<h2>基本信息</h2>

<ul>
  <li><strong>项目名称</strong>: ${values.projectName}</li>
  <li><strong>相关文档</strong>:
    <ul>
      <li><strong>PRD原型稿</strong>: ${values['documents.prdDocument'] || ''}</li>
      ${values['documents.backendDocument'] ? `<li><strong>后端技术文档</strong>: ${values['documents.backendDocument']}</li>` : ''}
      ${values['documents.frontendDocument'] ? `<li><strong>前端技术文档</strong>: ${values['documents.frontendDocument']}</li>` : ''}
      ${values['documents.uiDocument'] ? `<li><strong>UI稿</strong>: ${values['documents.uiDocument']}</li>` : ''}
      ${values['documents.smokeDoc'] ? `<li><strong>冒烟文档</strong>: ${values['documents.smokeDoc']}</li>` : ''}
    </ul>
  </li>
</ul>
`;
    } else if (showFrontend) {
      content += `<h1>前端项目信息</h1>`;
    } else if (showBackend) {
      content += `<h1>后端项目信息</h1>`;
    }

    // 项目信息部分
    if (showFrontend || showBackend) {
      content += `<h2>项目信息</h2>`;
      if (showFrontend)
        content += `
<h3>前端项目</h3>
${frontendTable}`;
      if (showBackend)
        content += `
<h3>后端项目</h3>
${backendTable}`;
    }

    // 服务端配置部分 - 仅当显示后端内容时才显示
    if (showBackend) {
      content += `<h2>服务端配置</h2>`;

      if (values['serverConfigs.apolloConfig']) {
        content += `
<h3>Apollo配置</h3>
<pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;"><code>${values['serverConfigs.apolloConfig']}</code></pre>`;
      }

      if (values['serverConfigs.databaseConfig']) {
        content += `
<h3>数据库配置</h3>
<pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;"><code>${values['serverConfigs.databaseConfig']}</code></pre>`;
      }

      if (values['serverConfigs.jobConfig']) {
        content += `
<h3>定时脚本&消费队列</h3>
<pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow: auto;"><code>${values['serverConfigs.jobConfig']}</code></pre>`;
      }

      if (customConfigs.length > 0) {
        content += `<h3>自定义配置</h3>${customConfigsHtml}`;
      }
    }

    // 开发分支和测试分支 - 对所有角色都显示
    if (values.developBranch || values.testBranch) {
      content += `
<h2>开发分支与测试分支</h2>
<ul>
  ${values.developBranch ? `<li><strong>开发分支</strong>: ${values.developBranch}</li>` : ''}
  ${values.testBranch ? `<li><strong>测试分支</strong>: ${values.testBranch}</li>` : ''}
</ul>`;
    }

    // 项目参与人员 - 仅PM角色显示
    if (showAll) {
      content += `
<h2>项目参与人员</h2>

<ul>
  <li><strong>产品人员</strong>: ${values['projectMembers.productManager'] || ''}</li>
  <li><strong>前端开发</strong>: ${values['projectMembers.frontendDeveloper'] || ''}</li>
  <li><strong>后端开发</strong>: ${values['projectMembers.backendDeveloper'] || ''}</li>
  <li><strong>测试人员</strong>: ${values['projectMembers.tester'] || ''}</li>
</ul>`;
    }

    // 备注 - 仅PM角色显示
    if (showAll) {
      content += `
<h2>备注</h2>
<p>${values.remark || '无'}</p>`;
    }

    return content;
  },
};

export default testReportTemplate;
