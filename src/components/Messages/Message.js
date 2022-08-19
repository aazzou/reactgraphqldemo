import React from 'react'
import { List, Divider, Icon, Card, Form, Button, Input, notification, Popconfirm} from 'antd';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'

import EditMessage from './EditMessage'


import MessageStore from '../../store/MessageStore'
import LoginStore from '../../store/LoginStore' 

import { gql } from 'apollo-boost';
import { Query, graphql, Mutation, withApollo } from "react-apollo";


const DELETE_MESSAGE_QL = gql`
    mutation delete_message($message_id: Int!){
        delete_message(message_id: $message_id)
  }
`

@observer
class Message extends React.Component {
    constructor (props){
        super(props);
        this.cancel = this.cancel.bind(this)
        this.delete = this.delete.bind(this)
        this.handleEditClick = this.handleEditClick.bind(this)
        this.state = {
            show_edit: false
        }
    }

    handleEditClick(){
        console.log( "edit" )
        console.log( this.props.id )

        this.setState({
            show_edit: true
        })
    }

    

    cancel() {

    }

    delete() {
        this.props.client.mutate({
            mutation: DELETE_MESSAGE_QL,
            variables: { message_id: parseInt( this.props.id ) },
        }).then(
        result => {
            if( result.data.delete_message ){
                MessageStore.deleteMessage( parseInt( this.props.id ) ) 
            }
        });
    }
    render() { 
        return( 
            <div>
        <List.Item
            key={this.props.key}
            actions={[<div>
                <Button onClick={this.handleEditClick} type="default" shape="circle" icon="edit" />
                &nbsp;
                <Popconfirm title="Are you sure delete this message?"
                            onConfirm={this.delete} onCancel={this.cancel}
                            okText="Yes"
                            cancelText="No">
                <Button type="danger" shape="circle" icon="delete" />
                </Popconfirm>
            </div>]}
        >
            <List.Item.Meta
            title={this.props.title}
            description={this.props.content}
            />
        </List.Item>
        <EditMessage visbility={this.state.show_edit} id={this.props.id} title={this.props.title} content={this.props.content} />
        </div>
        )
    }
}

export default withApollo(withRouter(Form.create()(Message)));