import { PageHeader } from 'antd'
import { useReachDetailContext } from './ReachDetailContext'
import { ErrorBoundary } from '../../Common/ErrorBoundary'
import { useNavigate } from 'react-router-dom'

export const Hero = () => {
  const { reach } = useReachDetailContext()
  const navigate = useNavigate()

  return (
    <ErrorBoundary>
      <PageHeader
        title={reach?.name || ''}
        subTitle={reach?.section || ''}
        onBack={() => navigate('/reach')}
      />
    </ErrorBoundary>
  )
}
