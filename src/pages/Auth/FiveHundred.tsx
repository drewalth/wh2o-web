import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

export const FiveHundred = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong on our end..."
        extra={
          <Button onClick={() => navigate('/')} type="primary">
            Back Home
          </Button>
        }
      />
    </div>
  )
}
