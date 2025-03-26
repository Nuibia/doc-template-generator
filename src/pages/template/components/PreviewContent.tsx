import { CopyOutlined, ExportOutlined, FileWordOutlined } from '@ant-design/icons';
import { Button, Card, Radio, Space } from 'antd';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../index.module.less';

interface PreviewContentProps {
  previewMode: 'rich' | 'markdown';
  setPreviewMode: (mode: 'rich' | 'markdown') => void;
  generatedContent: string;
  generatedHtmlContent: string;
  onCopy: () => void;
  onExportMarkdown: () => void;
  onExportDoc: () => void;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  previewMode,
  setPreviewMode,
  generatedContent,
  generatedHtmlContent,
  onCopy,
  onExportMarkdown,
  onExportDoc,
}) => {
  return (
    <Card variant="borderless">
      <div className={styles.previewHeader}>
        <Radio.Group
          value={previewMode}
          onChange={e => setPreviewMode(e.target.value)}
          buttonStyle="solid"
          className={styles.previewModeSelector}
        >
          <Radio.Button value="rich">富文本预览</Radio.Button>
          <Radio.Button value="markdown">Markdown预览</Radio.Button>
        </Radio.Group>

        <Space className={styles.previewActions}>
          {previewMode === 'markdown' && (
            <>
              <Button icon={<CopyOutlined />} onClick={onCopy}>
                复制到剪贴板
              </Button>
              <Button type="primary" icon={<ExportOutlined />} onClick={onExportMarkdown}>
                导出Markdown
              </Button>
            </>
          )}
          {previewMode === 'rich' && (
            <Button type="primary" icon={<FileWordOutlined />} onClick={onExportDoc}>
              导出Word
            </Button>
          )}
        </Space>
      </div>

      <div className={styles.previewContainer}>
        {previewMode === 'rich' ? (
          <div
            className={styles.htmlContent}
            dangerouslySetInnerHTML={{ __html: generatedHtmlContent }}
          />
        ) : (
          <div className={styles.markdownContent}>
            <ReactMarkdown>{generatedContent}</ReactMarkdown>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PreviewContent;
