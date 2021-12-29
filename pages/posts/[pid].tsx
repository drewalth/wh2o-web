import { GetServerSideProps, GetServerSidePropsContext } from 'next'

const PostDetail = () => {
  return <div>Post</div>
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  return {
    props: {
      id: Number(context.query.pid),
    },
  }
}

export default PostDetail
