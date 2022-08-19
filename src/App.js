import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'
import { observer } from 'mobx-react'


import { Login, Messages } from './pages/'
import DevTools from 'mobx-react-devtools';

const isLoggedIn = () => {
    let token = window.localStorage.getItem("graphqldemo:token");
    return (token !== null);
}

const PrivateRoute = ({ component: Component, ...rest }) => (

  <Route {...rest} render={props => (
    isLoggedIn() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)


@observer
class App extends React.Component {
  constructor (props){
    super(props)
  }

  render() {
    return (
      <div>
        <DevTools />
         <Router>
           <div>
            <Route exact path='/login' component={Login} />
            <PrivateRoute exact path='/messages' component={Messages} />
            <PrivateRoute exact path='/' component={Messages} />
          </div>
        </Router>
      </div>
    );

  }
}
export default withRouter(App)