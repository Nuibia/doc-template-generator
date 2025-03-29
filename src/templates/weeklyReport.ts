// 周报文档模板定义
import { TestReportTemplate } from './testReport';

const weeklyReportTemplate: TestReportTemplate = {
  id: 'weekly-report',
  name: '周报',
  description: '标准周报模板，包含项目进展、问题思考等',
  fields: [
    {
      id: 'name',
      name: 'name',
      type: 'text',
      label: '姓名',
      placeholder: '请输入姓名',
      required: true,
    },
    {
      id: 'date',
      name: 'date',
      type: 'text',
      label: '日期',
      placeholder: '请输入周报日期',
      required: true,
    },
    {
      id: 'projects',
      name: 'projects',
      type: 'table',
      label: '项目',
      required: true,
      columns: [
        {
          id: 'projectName',
          name: 'projectName',
          type: 'text',
          label: '项目名称',
          placeholder: '请输入项目名称',
          required: true,
        },
        {
          id: 'progress',
          name: 'progress',
          type: 'textarea',
          label: '本周进度',
          placeholder: '请输入本周进度',
          required: true,
        },
        {
          id: 'plan',
          name: 'plan',
          type: 'textarea',
          label: '下周计划',
          placeholder: '请输入下周计划',
          required: true,
        },
        {
          id: 'risk',
          name: 'risk',
          type: 'textarea',
          label: '风险',
          placeholder: '请输入项目风险',
          required: false,
        },
      ],
    },
    {
      id: 'thoughts',
      name: 'thoughts',
      type: 'table',
      label: '问题思考',
      required: false,
      columns: [
        {
          id: 'problem',
          name: 'problem',
          type: 'textarea',
          label: '问题',
          placeholder: '请输入问题描述',
          required: true,
        },
        {
          id: 'thinking',
          name: 'thinking',
          type: 'textarea',
          label: '思考',
          placeholder: '请输入思考内容',
          required: true,
        },
      ],
    },
    {
      id: 'others',
      name: 'others',
      type: 'table',
      label: '其他',
      required: false,
      columns: [
        {
          id: 'content',
          name: 'content',
          type: 'textarea',
          label: '内容',
          placeholder: '请输入其他内容',
          required: true,
        },
      ],
    },
  ],
  generateMarkdown: (values: Record<string, any>): string => {
    // 处理项目列表
    const projects = Array.isArray(values.projects) ? values.projects : [];
    const thoughts = Array.isArray(values.thoughts) ? values.thoughts : [];
    const others = Array.isArray(values.others) ? values.others : [];

    // 项目表格
    const projectsTable =
      projects.length > 0
        ? `
| 项目名称 | 本周进度 | 下周计划 | 风险 |
| --- | --- | --- | --- |${projects
            .map(
              p => `
| ${p.projectName || '-'} | ${p.progress || '-'} | ${p.plan || '-'} | ${p.risk || '-'} |`
            )
            .join('')}`
        : '';

    // 问题思考
    const thoughtsContent = thoughts
      .map(
        (t, index) => `
### 问题 ${index + 1}
**问题描述**：${t.problem || ''}

**思考内容**：${t.thinking || ''}`
      )
      .join('\n');

    // 其他内容
    const othersContent = others
      .map(
        (o, index) => `
### 其他 ${index + 1}
${o.content || ''}`
      )
      .join('\n');

    return `# ${values.name} 周报 - ${values.date}

## 项目进展${projectsTable}

## 问题思考
${thoughtsContent || '无'}

## 其他
${othersContent || '无'}
`;
  },

  generateHtml: (values: Record<string, any>): string => {
    // 处理项目列表
    const projects = Array.isArray(values.projects) ? values.projects : [];
    const thoughts = Array.isArray(values.thoughts) ? values.thoughts : [];
    const others = Array.isArray(values.others) ? values.others : [];

    // 项目表格
    const projectsTable =
      projects.length > 0
        ? `
<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th>项目名称</th>
      <th>本周进度</th>
      <th>下周计划</th>
      <th>风险</th>
    </tr>
  </thead>
  <tbody>
    ${projects
      .map(
        p => `
    <tr>
      <td>${p.projectName || ''}</td>
      <td>${p.progress || ''}</td>
      <td>${p.plan || ''}</td>
      <td>${p.risk || ''}</td>
    </tr>`
      )
      .join('')}
  </tbody>
</table>`
        : '<p>无项目进展</p>';

    // 问题思考
    const thoughtsContent = thoughts
      .map(
        (t, index) => `
<h3>问题 ${index + 1}</h3>
<p><strong>问题描述</strong>：${t.problem || ''}</p>
<p><strong>思考内容</strong>：${t.thinking || ''}</p>`
      )
      .join('\n');

    // 其他内容
    const othersContent = others
      .map(
        (o, index) => `
<h3>其他 ${index + 1}</h3>
<p>${o.content || ''}</p>`
      )
      .join('\n');

    return `
<h1>${values.name} 周报 - ${values.date}</h1>

<h2>项目进展</h2>
${projectsTable}

<h2>问题思考</h2>
${thoughtsContent || '<p>无</p>'}

<h2>其他</h2>
${othersContent || '<p>无</p>'}
`;
  },
};

export default weeklyReportTemplate;
