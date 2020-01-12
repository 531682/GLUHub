import React from "react";
import firebase from "../../firebase";
// prettier-ignore
import { Grid, Header, Icon,  Image, Modal, Button , Message} from "semantic-ui-react";
import {Link} from 'react-router-dom'
class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    usersRef: firebase.database().ref("users"),
    admin:false
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });


  componentDidMount(){
    var userId = this.state.user.uid
    firebase.database().ref('admins/' + userId + '/admin').on('value', snap =>{
      if(snap.val() === true){
        this.setState({admin:true})
      }
    })
  }

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed out!"));
  };

  render() {
    const { user, modal} = this.state;
    const { primaryColor } = this.props;

    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content color="white">Glu-lmao</Header.Content>
            </Header>

            {/* User Dropdown  */}
            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <span className="span-userpanel" onClick={this.openModal}>
                <Image src={user.photoURL} spaced="right" avatar />
                {user.displayName}
              </span>                    
            </Header>
          </Grid.Row>
          <Modal open={modal} onClose={this.closeModal}>
            <Modal.Header>Settings for {user.displayName}</Modal.Header>
            <Modal.Content image>
              <Image wrapped small size="small" src={user.photoURL} />
              <Modal.Description>
                <Button onClick={this.handleSignout}>Sign out</Button>
                {this.state.admin === true && <Link to="/admin"><Button>Admin</Button></Link>}
                {this.state.admin === true && <Message>Admin</Message>}
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
