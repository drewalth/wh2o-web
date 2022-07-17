import { Typography } from 'antd'
import { useFlowContext } from './FlowContext'
import './flow-header.scss'
import { GageBookmarkToggle } from '../../../Common/GageBookmarkToggle'

export const FlowHeader = () => {
  const { gage } = useFlowContext()

  return (
    <div className={'flow-header'}>
      <div>
        <Typography.Title level={4}>{gage?.name || 'n/a'}</Typography.Title>
      </div>
      {gage && <GageBookmarkToggle gageId={gage.id} type={'icon'} />}
    </div>
  )
}
