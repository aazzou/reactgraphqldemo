import { observable, action, computed } from 'mobx'

class LoginSore {
  @observable credentials = {}

  @action authenticate(credentials) {
    this.credentials = credentials
  }

  @action logout(){
    this.credentials = {}
  }

  @computed get isLoggedIn(){
    return Object.keys(this.credentials).length > 0;
  }
  
  @action getCredentials(){
    let credentials = this.credentials;
    return credentials;
  }

}


export default new LoginSore();
