import { Tooltip, TooltipProps } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import React from 'react'

export const HelpTooltip = (tooltipProps: TooltipProps) => {
  return (
    <Tooltip {...tooltipProps}>
      <QuestionCircleOutlined />
    </Tooltip>
  )
}
