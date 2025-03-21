// 发布计划模板定义

import { TemplateField } from './testReport';

export interface ReleasePlanTemplate {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  generateMarkdown: (values: Record<string, any>) => string;
}

const releasePlanTemplate: ReleasePlanTemplate = {
  id: 'release-plan',
  name: '发布计划',
  description: '详细的发布计划文档，包含发布时间、功能列表、风险评估等',
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
      id: 'version',
      name: 'version',
      type: 'text',
      label: '版本号',
      placeholder: '如: v1.0.0',
      required: true,
    },
    {
      id: 'releaseDate',
      name: 'releaseDate',
      type: 'date',
      label: '计划发布日期',
      required: true,
    },
    {
      id: 'releaseTime',
      name: 'releaseTime',
      type: 'text',
      label: '发布时间',
      placeholder: '如: 14:00-16:00',
      required: true,
    },
    {
      id: 'releaseManager',
      name: 'releaseManager',
      type: 'text',
      label: '发布负责人',
      placeholder: '负责本次发布的人员',
      required: true,
    },
    {
      id: 'developers',
      name: 'developers',
      type: 'text',
      label: '开发人员',
      placeholder: '开发人员姓名，多人用逗号分隔',
      required: true,
    },
    {
      id: 'testers',
      name: 'testers',
      type: 'text',
      label: '测试人员',
      placeholder: '测试人员姓名，多人用逗号分隔',
      required: true,
    },
    {
      id: 'releaseBranch',
      name: 'releaseBranch',
      type: 'text',
      label: '发布分支',
      placeholder: '如: release/v1.0.0',
      defaultValue: 'release/',
      required: true,
    },
    {
      id: 'featureList',
      name: 'featureList',
      type: 'textarea',
      label: '功能列表',
      placeholder: '请列出本次发布的功能点，每行一个功能',
      required: true,
    },
    {
      id: 'bugfixList',
      name: 'bugfixList',
      type: 'textarea',
      label: 'Bugfix列表',
      placeholder: '请列出本次发布修复的Bug，每行一个',
      required: false,
    },
    {
      id: 'releasePlan',
      name: 'releasePlan',
      type: 'textarea',
      label: '发布计划步骤',
      placeholder: '请详细描述发布步骤',
      required: true,
    },
    {
      id: 'rollbackPlan',
      name: 'rollbackPlan',
      type: 'textarea',
      label: '回滚计划',
      placeholder: '如果发布失败，如何回滚',
      required: true,
    },
    {
      id: 'riskAssessment',
      name: 'riskAssessment',
      type: 'textarea',
      label: '风险评估',
      placeholder: '本次发布可能的风险点及应对措施',
      required: true,
    },
    {
      id: 'postReleaseMonitoring',
      name: 'postReleaseMonitoring',
      type: 'textarea',
      label: '发布后监控',
      placeholder: '发布后需要监控的指标',
      required: false,
    },
    {
      id: 'remarks',
      name: 'remarks',
      type: 'textarea',
      label: '备注',
      placeholder: '其他需要备注的信息',
      required: false,
    },
  ],
  generateMarkdown: (values: Record<string, any>): string => {
    return `# ${values.projectName} 发布计划

## 基本信息

- **项目名称**: ${values.projectName}
- **版本号**: ${values.version}
- **计划发布日期**: ${values.releaseDate}
- **发布时间**: ${values.releaseTime}
- **发布负责人**: ${values.releaseManager}
- **开发人员**: ${values.developers}
- **测试人员**: ${values.testers}
- **发布分支**: ${values.releaseBranch}

## 功能列表

${values.featureList}

${values.bugfixList ? `## Bugfix列表\n\n${values.bugfixList}` : ''}

## 发布计划步骤

${values.releasePlan}

## 回滚计划

${values.rollbackPlan}

## 风险评估

${values.riskAssessment}

${values.postReleaseMonitoring ? `## 发布后监控\n\n${values.postReleaseMonitoring}` : ''}

${values.remarks ? `## 备注\n\n${values.remarks}` : ''}
`;
  },
};

export default releasePlanTemplate;
