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

const ADD_MESSAGE_QL = gql`
    mutation add_message($title: String!, $content: String!){
        add_message(message: {
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
class AddMessage extends React.Component {
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
                mutation: ADD_MESSAGE_QL,
                variables: { title: values.title, content: values.content },
            }).then(
            result => {
                if( result.data.add_message ){
                        let message = {
                                key: result.data.add_message.id,
                                id: result.data.add_message.id,
                                title: result.data.add_message.title,
                                content: result.data.add_message.content
                          }
                        MessageStore.addMessage( message ) 
                }
                              
            });
            this.props.form.resetFields()
          }
        });
    }

    render() { 
        const { getFieldDecorator } = this.props.form;
        return( 
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
                        Add Message
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default withApollo(withRouter(Form.create()(AddMessage)));