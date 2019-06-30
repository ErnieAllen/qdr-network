import React from "react";
import { Dropdown, DropdownToggle, DropdownItem } from "@patternfly/react-core";

class DropdownTopology extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      topology: this.props.topology
    };
    this.onToggle = isOpen => {
      this.setState({
        isOpen
      });
    };
    this.onSelect = event => {
      this.props.handleChooseTopology(event.target.textContent);
      this.setState({
        isOpen: !this.state.isOpen,
        topology: event.target.textContent
      });
    };
  }

  render() {
    const { isOpen, topology } = this.state;
    const dropdownItems = [
      <DropdownItem key="linear" component="button">
        Linear
      </DropdownItem>,
      <DropdownItem key="mesh" component="button">
        Mesh
      </DropdownItem>,
      <DropdownItem key="star" component="button">
        Star
      </DropdownItem>
    ];
    return (
      <Dropdown
        onSelect={this.onSelect}
        toggle={
          <DropdownToggle onToggle={this.onToggle}>{topology}</DropdownToggle>
        }
        isOpen={isOpen}
        dropdownItems={dropdownItems}
      />
    );
  }
}

export default DropdownTopology;
