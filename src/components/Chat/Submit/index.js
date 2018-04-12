import React, { Component } from 'react';
class Submit extends Component {
  constructor(props){
        super(props);
        this.state = {
            messageText: ""
        };
  };
  changeMessageText(messageText){
    this.setState({messageText});
  };
  sendMessage(messageText){
   console.log(messageText);
   this.changeMessageText(""); 
  };
  render() {
    return (
        <div id="submitBox">
            <form onSubmit= { e => {e.preventDefault();this.props.sendMessage(this.state.messageText);this.setState({messageText:""})}}>
                <input type="text" placeholder="send a message!" 
                       value={this.state.messageText} 
                       onChange={e => {
                            e.preventDefault();
                            this.changeMessageText(e.target.value)
                        }}>
                </input>
                <button type="submit">Send</button>
            </form>
        </div>
    );
  };
}

export default Submit;
