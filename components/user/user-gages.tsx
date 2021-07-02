import { IGage } from 'interfaces'
import { Button, Card, Table } from 'antd'
import moment from 'moment'
import Link from 'next/link'

interface UserGagesProps {
  gages: IGage[]
  userId: number
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },

  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: 'Latest Reading',
    dataIndex: 'latestReading',
    key: 'latestReading',
  },
  {
    title: 'Updated',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (updatedAt: Date) => <span>{moment(updatedAt).format('LLL')}</span>,
  },
  {
    dataIndex: 'id',
    key: 'id',
    render: (gageId: number) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button disabled>
          <Link href={`/gages/${gageId}`}>view</Link>
        </Button>
      </div>
    ),
  },
]

export const UserGages = (props: UserGagesProps) => {
  const { gages, userId } = props
  return (
    <Card>
      <Table columns={columns} dataSource={props.gages}></Table>
    </Card>
  )
}
