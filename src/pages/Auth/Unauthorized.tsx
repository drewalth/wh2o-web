import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

export const Unauthorized = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <>
            <Button
              onClick={() => navigate('/auth/login', { replace: true })}
              type="primary"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/auth/register', { replace: true })}
            >
              Sign Up
            </Button>
          </>
        }
      />
    </div>
  )
}
