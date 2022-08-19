import { observable, action, computed } from 'mobx'

class MessageStore {
  @observable messages = []

  @action flush(){
    this.messages = []
  }
  
  @action addMessage(message) {
    this.messages.push({
      key: message.id,
      id: message.id,
      title: message.title,
      content: message.content
    });
  }

  @action replaceAllMessages(messages){
    this.n = messages;
  }

  @action getMessage(id){
    let messages = this.messages;
    let result = messages.filter(function(message){
        return message.id === id;
    });

    return result[0];
  }

  @action deleteMessage(id){
    let messages = this.messages;

    let result = messages.filter(function(message){
      return parseInt( message.id ) === parseInt( id );
    });
    
    if(result.length > 0){
        messages.splice(messages.indexOf(result[0]), 1)
    }

    this.messages = messages;
  }


  @computed get messagesCount  (){
    return this.messages.length;
  }

}


export default new MessageStore();
