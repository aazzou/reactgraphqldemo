import React from 'react'
import { List, Divider, Icon, Card, Form, Button, Input, notification, Popconfirm} from 'antd';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'


import MessageStore from '../../store/MessageStore'
import LoginStore from '../../store/LoginStore' 

import Message from './Message'
import AddMessage from './AddMessage'

import { gql } from 'apollo-boost';
import { Query, graphql, Mutation, withApollo } from "react-apollo";

const MESSAGES_LIST = gql`
  query {
    messages {
        id
        title
        content
    }
  }
`

const { TextArea } = Input;

@observer
class Messages extends React.Component {
    constructor (props){
        super(props);
        this.handleLogoutClick = this.handleLogoutClick.bind(this)
    }


    handleLogoutClick(){
        console.log( "Handle Logout click" );   
        window.localStorage.removeItem("owline:token")
        LoginStore.logout();
        this.props.history.push("/login") 
    }

    componentDidMount() {
        this.props.client.query({
            query: MESSAGES_LIST
        }).then(
        result => {

            console.log( "in this client");
            MessageStore.flush()
            result.data.messages.forEach((d) => {
            let index = MessageStore.messagesCount + 1;
            let message = {
              key: d.id,
              id: d.id,
              title: d.title,
              content: d.content
            }
    
            MessageStore.addMessage( message )
        }
        );
        });

      }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        let messages = toJS(MessageStore.messages);
        let username =  window.localStorage.getItem("graphqldemo:email");
        const IconText = ({ type, text }) => (
        <span>
            <Icon type={type} style={{ marginRight: 8 }} />
            {text}
        </span>
        );
        return (
            <Grid fluid>
            <Row>
               <Col xs={6} md={8} mdOffset={2}>
                    <br />
                    <Card  title="Messages" extra={<a onClick={this.handleLogoutClick} href="#"> {username} | Logout</a>}>
                    <List
                        itemLayout="horizontal"
                        size="large"
                        dataSource={messages}
                        renderItem={item => (
                            <Message key={item.id} id={item.id} title={item.title} content={item.content} />
                        )}
                    />
                    
                    <div>
                    <Divider orientation="right">Add new message</Divider>
                    <AddMessage />
                    </div>

                    </Card>
                </Col>
             </Row>
            </Grid>
        )
    }
}

export default withApollo(withRouter(Form.create()(Messages)));