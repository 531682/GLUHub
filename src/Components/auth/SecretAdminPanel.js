import React, {Component} from 'react'
import firebase from '../../firebase'
import md5 from 'md5'
import {
    Grid,
    Form,
    Button,
    Header,
    Message,
    Icon,
} from "semantic-ui-react";
import { Link } from 'react-router-dom'
class Secret extends Component {
    state ={
        username:"",
        email:"",
        password:"",
        passwordConfirmation:"",
        errors:[],
        loading:false,
        adminsRef: firebase.database().ref("admins")
    }

    isFormValid =() => {
        let errors = []
        let error

        if(this.isFormEmpty(this.state)){
            error = { message: "Fill in all fields"}
            this.setState({errors: errors.concat(error)})
            return false;
        }else if(!this.isPasswordValid(this.state)){
            error = {message: "Password is invalid"}
            this.setState({errors: errors.concat(error)})
            return false
        }else{
            return true
        }
    }

    isFormEmpty = ({username, email, password, passwordConfirmation}) =>{
        return(
            !username.length ||
            !email.length ||
            !password.length ||
            !passwordConfirmation.length
        )
    }

    isPasswordValid = ({password, passwordConfirmation}) =>{
        if(password.length < 6 || passwordConfirmation.length < 6){
            return false
        }else if(password !== passwordConfirmation){
            return false
        }else{
            return true
        }
    }
    
    displayErrors = errors =>
        errors.map((error, i) => <p key={i}>{error.message}</p>)
    
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value})
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid()) {
          this.setState({ errors: [], loading: true, admin:true});
          firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(createdUser => {
              console.log(createdUser);
              createdUser.user
                .updateProfile({
                  displayName: this.state.username,
                  photoURL: `http://gravatar.com/avatar/${md5(
                      createdUser.user.email
                  )}?d=identicon`,
                  admin:this.state.admin
                })
                .then(() => {
                  this.saveUser(createdUser).then(() => {
                    console.log("user saved");
                  });
                })
                .catch(err => {
                  console.error(err);
                  this.setState({
                    errors: this.state.errors.concat(err),
                    loading: false
                  });
                });
            })
            .catch(err => {
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
        }
    };

    saveUser = createdUser =>{
        return this.state.adminsRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL,
            admin:this.state.admin
        })
    }

    handleInputError = (errors, inputName) =>{
        return errors.some(error => error.message.toLowerCase().includes(inputName))
        ? "error"
        : ""
    }

    render(){
        const {
            username,
            email,
            password,
            passwordConfirmation,
            errors,
            loading
        } = this.state;
        return(
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as="h1" icon color="blue" textAlign="center">
                        <Icon name="hand spock" color="blue"/>
                        Register for GLU-Hub
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Form.Input
                            fluid
                            name="username"
                            placeholder="Username"
                            onChange={this.handleChange}
                            value={username}
                            type="text"
                            icon="user"
                            iconPosition="left"
                        />
                        
                        <Form.Input
                            fluid
                            name="email"
                            placeholder="Email Address"
                            onChange={this.handleChange}
                            value={email}
                            type="email"
                            icon="mail"
                            iconPosition="left"
                        />

                        <Form.Input
                            fluid
                            name="password"
                            placeholder="Password"
                            onChange={this.handleChange}
                            value={password}
                            type="password"
                            icon="lock"
                            iconPosition="left"
                        />

                        <Form.Input 
                            fluid
                            name="passwordConfirmation"
                            placeholder="Confirmation"
                            onChange={this.handleChange}
                            value={passwordConfirmation}
                            type="password"
                            icon="lock"
                            iconPosition="left"
                        />

                        <Button
                            disabled={loading}
                            className={loading ? "loading" : ""}
                            color="blue"
                            fluid
                            size="large"
                        >
                            Register
                        </Button>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>
                        Already have an account? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>  
            </Grid>
        )
    }
}

export default Secret