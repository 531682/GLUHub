import React, {useState}  from "react";
import moment from "moment";
import { Comment, Image, Modal, Button} from "semantic-ui-react";
import firebase from '../../firebase'
const Message= ({message, user}) => {
    const [showModal, setModal] = useState(false)
    const [showConfirm, setConfirm] = useState(false)
    const [showAdmin, setAdmin] = useState(false)
    const isOwnMessage = (message, user) =>{
        return message.user.id === user.uid ? "message__self" : ""
    }

    const isImage = message =>{
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    }

    const timeFromNow = timestamp => moment(timestamp).fromNow()

    const makeAdmin = (message, user) =>{
      firebase.database().ref("users/" + message.user.id +"/admin").on("value", snap=>{
        if(snap.val() === false){
          return null
        } else{
          firebase
          .database()
          .ref("users/" + message.user.id + "/admin")
          .on("value", snap =>{
            if(snap.val() === true){
              console.log('already admin!')
            }else{
              firebase.database().ref("users/" + message.user.id).set({
                admin:true
              }) 
              console.log(snap)
            }
          })
        }
      })
    }

    const makeModerator = (message, user) =>{
      firebase.database().ref("users/" + message.user.id +"/moderator").on("value", snap=>{
        if(snap.val() === false){
          return null
        } else{
          firebase
          .database()
          .ref("users/" + message.user.id + "/moderator")
          .on("value", snap =>{
            if(snap.val() === true){
              console.log('You are already Moderator!')
            }else{
              firebase.database().ref("users/" + message.user.id).set({
                moderator:true
              }) 
              console.log(snap)
            }
          })
        }
      })
    }

    return (
        <div>
            <Comment>
              <Comment.Avatar src={message.user.avatar} />
              <Comment.Content className={isOwnMessage(message, user)}>
                  <Comment.Author onClick={() => setModal(true)} as="a" >{message.user.name}</Comment.Author>
                  <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
                    {isImage(message) ? (
                    <Image src={message.image} className="message__image" />
                    ) : (
                    <Comment.Text className="message">{message.content}</Comment.Text>
                    )}
                </Comment.Content>
            </Comment>
            <Modal open={showModal} closeIcon onClose={() => setModal(false)}>
                <Modal.Header>
                  {message.user.name}
                </Modal.Header>
                <Modal.Content image>
                  <Image wrapped small size="small" src={message.user.avatar}/>  
                  <Modal.Description>
                      <Button onClick={()=> setConfirm(true)}>Make user Moderator</Button>
                      {/* <Button onClick={()=> setAdmin(true)}>Make user Admin</Button> */}
                  </Modal.Description>
                </Modal.Content>
            </Modal>
            <Modal open={showConfirm} closeIcon size="mini" onClose ={()=> setConfirm(false)}>
              <Modal.Header>
                Make {message.user.name} moderator
              </Modal.Header>
              <Modal.Content>
                <p>Are you sure?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={()=> setConfirm(false)}negative>No</Button>
                <Button onClick={() => makeModerator(message, user)} positive icon="checkmark" labelPosition="right" content="Yes"/>
              </Modal.Actions>
            {/* </Modal>
            <Modal open={showAdmin} closeIcon onClose={() => setAdmin(false)}>
              <Modal.Header>
                Make {message.user.name} admin? 
              </Modal.Header>
              <Modal.Content>
                Are you sure?
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => setAdmin(false)} negative>No</Button>
                <Button onClick={() => makeAdmin(message, user)} positive icon="checkmark" labelPosition="right" content="Yes"/>
              </Modal.Actions> */}
            </Modal>
        </div>
    )
}
export default Message