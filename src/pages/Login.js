import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';

import '../App.css'

import Login from '../components/Login'

export default class LoginPage extends React.Component {
    render() {
        return (
            <div id="login-page">
                <Login   />
            </div>
        )
    }
}