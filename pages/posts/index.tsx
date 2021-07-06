import { Button, Layout, PageHeader } from 'antd'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()
  return (
    <>
      <Layout>
        <PageHeader
          onBack={() => router.push('/')}
          title="Posts"
          extra={
            <Button
              key="1"
              type="primary"
              onClick={() => router.push('/posts/creator')}
            >
              Create Post
            </Button>
          }
        />
        <Layout.Content>content</Layout.Content>
      </Layout>
    </>
  )
}

export default Index
