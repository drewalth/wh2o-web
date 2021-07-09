import { Component } from 'react'
import { Row, Col, Card, Modal, Button, Form, Input, AutoComplete } from 'antd'
import { Notification, Gage, User } from 'interfaces'
import { connect } from 'react-redux'
import { RootState } from 'store'
import { createUserGageNotify } from 'controllers'

interface FlowRangeEditorProps {
  userId: number
  entity: string // USER or GAGE
  user: User
  gages: Gage[]
}

interface FlowRangeEditorState extends Notification {
  form: any
  modalVisible: boolean
}

const mapStateToProps = (state: RootState) => ({
  user: state.user.data,
  gages: state.gages.data,
})

class FlowRangeEditor extends Component<
  FlowRangeEditorProps,
  FlowRangeEditorState
> {
  constructor(props: FlowRangeEditorProps) {
    super(props)
    // @ts-ignore
    this.state = {
      active: false,
      count: 0,
      gageDisabled: false,
      gageId: 0,
      primary: false,
      userId: 0,
      form: {},
      modalVisible: false
    }
  }

  async handleSubmit() {
    try {
      const result = await createUserGageNotify({ userId: this.props.userId })
      console.log(result)
    } catch (e) {
      console.log('e: ', e)
    } finally {
      console.log('end')
    }
  }

  render() {
    return (
      <>
        <Row>
          <Col>
            <Card
              extra={
                <Button onClick={() => this.setState({ modalVisible: true })}>
                  Add Range
                </Button>
              }
            >
              <div>{JSON.stringify(this.props.user)}</div>
            </Card>
          </Col>
        </Row>
        <Modal
          visible={this.state.modalVisible}
          onCancel={() => this.setState({ modalVisible: false })}
        >
          <Form
            onValuesChange={(evt) => {
              console.log(evt)
            }}
          >
            <Form.Item label="Minimum" name="minimum">
              <Input />
            </Form.Item>
            <Form.Item label="Maximum" name="maximum">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  }
}

export default connect(mapStateToProps)(FlowRangeEditor)
