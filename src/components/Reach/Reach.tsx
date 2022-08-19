import { ReachTable } from './ReachTable'
import { PageHeader } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ReachSearchForm } from './ReachSearchForm'

export const Reach = () => {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader title={`${t('reach')}  ${t('search')}`} />
      <ReachSearchForm />
      <ReachTable />
    </>
  )
}
