import PrimaryNavigation from '../components/global/primary-navigation'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const About = () => {
  return (
    <>
      <PrimaryNavigation />
      <div>
        <h1>About</h1>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string)),
    },
  }
}

export default About
