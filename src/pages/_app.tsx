import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { AppProps } from 'next/app';

// 导入全局样式
import '@/styles/global.less';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={zhCN}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;
