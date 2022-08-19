import React from 'react'
import { List, Divider, Icon, Card, Form, Button, Input, notification, Popconfirm} from 'antd';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'


import MessageStore from '../../store/MessageStore'
import LoginStore from '../../store/LoginStore' 

import { gql } from 'apollo-boost';
import { Query, graphql, Mutation, withApollo } from "react-apollo";

const { TextArea } = Input;

const EDIT_MESSAGE_QL = gql`
    mutation edit_message($message_id: Int!, $title: String!, $content: String!){
        edit_message(
            message_id: $message_id,
            message: {
            title: $title,
            content: $content
        }){
            id
            content
            title
        }
  }
`


@observer
class EditMessage extends React.Component {
    constructor (props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log( "clicked!" );
        console.log( this.props );
        this.props.form.validateFields((err, values) => {
          if (!err) {

            this.props.client.mutate({
                mutation: EDIT_MESSAGE_QL,
                variables: { message_id: parseInt( this.props.id ), title: values.title, content: values.content },
            }).then(
            result => {
                if( result.data.edit_message ){
                        MessageStore.deleteMessage( parseInt( this.props.id ) )
                        let message = {
                                key: result.data.edit_message.id,
                                id: result.data.edit_message.id,
                                title: result.data.edit_message.title,
                                content: result.data.edit_message.content
                          }
                        MessageStore.addMessage( message ) 
                }
                              
            });
            this.props.form.resetFields()
          }
        });
    }

    componentDidMount(){
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            title: this.props.title,
            content: this.props.content
        })
    }

    render() { 
        const { getFieldDecorator } = this.props.form;
        const displayConfig = ( this.props.visbility ) ? "block" : "none"
            return( 
                <Card style={{display: displayConfig}}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('title', {
                        rules: [{ required: true, message: 'Please input a title!' }],
                        })(
                        <Input prefix={<Icon type="bars" style={{ fontSize: 13 }} />} />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('content', {
                        rules: [{ required: true, message: 'Please input a message!' }],
                        })(
                            <TextArea rows={4}  />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit"  type="primary">
                            Edit Message
                        </Button>
                    </Form.Item>
                </Form>
                </Card>
            )
        
    }
}

export default withApollo(withRouter(Form.create()(EditMessage)));