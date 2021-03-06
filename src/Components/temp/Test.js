import React from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import SidePanel from "./Components/SidePanel/SidePanel";
import Repos from './Components/Data/Repos'
import '../../App.css'
const Test = ({ currentUser}) => (
  <Grid columns="equal" className="git-app" style={{ background: "" }}>
    <SidePanel key={currentUser && currentUser.uid} currentUser={currentUser} />
    <Grid.Column style={{marginLeft: 320}}>
      <Repos currentUser={currentUser}/>
    </Grid.Column>
  </Grid>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Test);
