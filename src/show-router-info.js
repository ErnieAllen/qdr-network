import React from 'react';
import { Button, TextContent, Text } from '@patternfly/react-core';

class ShowRouterInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const showInfo = () => {
      if (this.props.currentRouter) {
        return (
          <React.Fragment>
            <Button variant="primary" onClick={this.props.handleAddEdge}>
              Add Edge
            </Button>
          </React.Fragment>
        );
      }
      return (
        <TextContent>
          <Text component="h1">No router chosen. Click on a router.</Text>
        </TextContent>
      );
    };
    return (
      <div className="address-table-container">
        <TextContent>
          <Text component="h1">
            Router info
            <br />
            {this.props.currentRouter ? this.props.currentRouter : ''}
          </Text>
        </TextContent>
        {showInfo()}
      </div>
    );
  }
}

export default ShowRouterInfo;
