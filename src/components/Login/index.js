import React from 'react'
import { Form, Icon, Input, Button, Checkbox, notification, Card } from 'antd';
import { Grid, Row, Col } from 'react-flexbox-grid';
import LoginStore from '../../store/LoginStore' 
import { withRouter } from 'react-router-dom'

import gql from "graphql-tag";
import { graphql, Mutation } from "react-apollo";

const FormItem = Form.Item;

const LOGIN_USER_QL = gql`
  mutation logged_in_user($email: String!, $password: String!){
    logged_in_user(auth: {email: $email, password: $password} ){
      ok,
      jwt,
      user {
        id
        email
      }
    }
  }
`

class Login extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
    
            this.props.mutate({variables: {email: values.email, password: values.password}})
            .then((result) => { 
                var query_result = result.data.logged_in_user;
                if(  query_result &&  query_result.ok){
                  LoginStore.authenticate({
                    email: values.email,
                    token: result.data.logged_in_user.jwt
                  })
                console.log( result.data.logged_in_user )
                window.localStorage.setItem("graphqldemo:token", result.data.logged_in_user.jwt)
                window.localStorage.setItem("graphqldemo:email", result.data.logged_in_user.user.email)
                
                try{
                  let url_from = this.props.history.location.state.from.pathname;
                  this.props.history.push(url_from)
                }catch(e){
                  this.props.history.push("/messages")
                }
                }else{
                  notification["error"]({
                    message: 'Wrong authentication',
                    description: 'Wrong email/password, please try again.',
                  });
                }
            })
          }
        });
      }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Grid fluid>
             <Row>
                <Col xs={6} md={6} mdOffset={3}>
                <Card>
                <Form onSubmit={this.handleSubmit} className="login-form">
                <Row>
                    <Col md={12}>
                    <FormItem>
                        {getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                        <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="admin@company.com" />
                        )}
                    </FormItem>
                    </Col>
                    <Col md={12}>
                    <FormItem>
                        {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    </Col>
                    <Col md={12} pull="right">
                    <FormItem>
                    <Button block type="primary" htmlType="submit" className="login-form-button block" style={{float: "right"}}>
                        Log in
                    </Button>
                    </FormItem>
                    </Col>
            </Row>
          </Form>
          </Card> 
                </Col>
            </Row>
          </Grid>
      )
    }
}

const LoginQL = graphql(
  LOGIN_USER_QL
)(Login);


export default withRouter(Form.create()(LoginQL));