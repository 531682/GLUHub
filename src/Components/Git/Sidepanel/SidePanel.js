import React from "react";
import { Menu, Button } from "semantic-ui-react";
import UserPanel from "./Userpanel";
class SidePanel extends React.Component {
  render() {
    const { currentUser} = this.props;

    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{fontSize: "1.2rem"}}
      >
        <UserPanel currentUser={currentUser} />
      </Menu>
    );
  }
}

export default SidePanel;
