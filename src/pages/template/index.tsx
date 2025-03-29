import { useRouter } from 'next/router';
import { useEffect } from 'react';

const TemplateIndex = () => {
  const router = useRouter();
  const { id = 'test-report' } = router.query;

  useEffect(() => {
    if (router.isReady) {
      // 重定向到动态路由页面
      router.replace(`/template/${id}`);
    }
  }, [router, id]);

  // 返回空组件，等待重定向
  return null;
};

export default TemplateIndex;
