import React from "react";
import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownPosition,
  DropdownItem,
  InputGroup,
  KebabToggle,
  TextInput,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from "@patternfly/react-core";
import { SearchIcon, SortAlphaDownIcon } from "@patternfly/react-icons";

class EdgeTableToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropDownOpen: false,
      isKebabOpen: false,
      searchValue: ""
    };
    this.handleTextInputChange = value => {
      this.setState({ searchValue: value });
    };

    this.onDropDownToggle = isOpen => {
      this.setState({
        isDropDownOpen: isOpen
      });
    };

    this.onDropDownSelect = event => {
      this.setState({
        isDropDownOpen: !this.state.isDropDownOpen
      });
    };

    this.onKebabToggle = isOpen => {
      this.setState({
        isKebabOpen: isOpen
      });
    };

    this.onKebabSelect = event => {
      this.setState({
        isKebabOpen: !this.state.isKebabOpen
      });
    };

    this.buildSearchBox = () => {
      let { value } = this.state.searchValue;
      return (
        <InputGroup>
          <TextInput
            value={value ? value : ""}
            type="search"
            onChange={this.handleTextInputChange}
            aria-label="search text input"
            placeholder="search for edge routers"
          />
          <Button
            variant={ButtonVariant.tertiary}
            aria-label="search button for search input"
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      );
    };

    this.buildKebab = () => {
      const { isKebabOpen } = this.state;

      return (
        <Dropdown
          onSelect={this.onKebabSelect}
          position={DropdownPosition.right}
          toggle={<KebabToggle onToggle={this.onKebabToggle} />}
          isOpen={isKebabOpen}
          isPlain
          dropdownItems={[
            <DropdownItem key="link">Link</DropdownItem>,
            <DropdownItem component="button" key="action_button">
              Action
            </DropdownItem>,
            <DropdownItem isDisabled key="disabled_link">
              Disabled Link
            </DropdownItem>,
            <DropdownItem isDisabled component="button" key="disabled_button">
              Disabled Action
            </DropdownItem>
          ]}
        />
      );
    };
  }

  render() {
    return (
      <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md">
        <ToolbarGroup>
          <ToolbarItem className="pf-u-mr-md">
            {this.buildSearchBox()}
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="plain" aria-label="Sort A-Z">
              <SortAlphaDownIcon />
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup className="edge-table-actions">
          <ToolbarItem className="pf-u-mx-sm">
            <Button aria-label="Delete" onClick={this.props.handleDeleteEdge}>
              Delete
            </Button>
          </ToolbarItem>
          <ToolbarItem className="pf-u-mx-sm">
            <Button aria-label="Add" onClick={this.props.handleAddEdge}>
              Add
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default EdgeTableToolbar;
