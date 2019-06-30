import React from "react";
import {
  Button,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  TextContent,
  Text,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from "@patternfly/react-core";

import {} from "@patternfly/react-core";

import Graph from "./graph";
import NetworkName from "./network-name";
import NodesLinks from "./nodeslinks";
import TopologyContext from "./topology-context";

class ChooseTopology extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      networkInfo: { routers: 0, name: "network name", nodes: [], links: [] },
      dimensions: null
    };
    this.nodesLinks = new NodesLinks();
  }

  componentDidMount() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      }
    });
  }

  handleNetworkNameChange = name => {
    const { networkInfo } = this.state;
    networkInfo.name = name;
    this.setState({ networkInfo });
  };

  handleAddInterior = () => {
    const { networkInfo } = this.state;
    networkInfo.routers++;
    this.updateNodesLinks(networkInfo);
    this.setState({ networkInfo });
  };

  updateNodesLinks = networkInfo => {
    const { nodes, links } = this.nodesLinks.setNodesLinks(
      networkInfo,
      this.state.dimensions
    );
    networkInfo.nodes = nodes;
    networkInfo.links = links;
    console.log(`changing routers to ${networkInfo.routers}`);
  };

  onToggle = isOpen => {
    this.setState({
      isOpen
    });
  };

  onSelect = event => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Welcome to network creator</Text>
            <Text component="p" className="tag-line">
              Create a router network, add routers and edges, deploy!
            </Text>
          </TextContent>
          <NetworkName
            handleNetworkNameChange={this.handleNetworkNameChange}
            networkInfo={this.state.networkInfo}
          />
        </PageSection>
        <PageSection variant={PageSectionVariants.light}>
          <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md network-toolbar">
            <ToolbarGroup>
              <ToolbarItem className="pf-u-mx-md">
                <Button
                  aria-label="add interior router"
                  onClick={this.handleAddInterior}
                  variant="tertiary"
                >
                  Add Interior router
                </Button>
              </ToolbarItem>
              <ToolbarItem className="pf-u-mx-md">
                <Button aria-label="add edge class" variant="tertiary">
                  Add Edge class
                </Button>
              </ToolbarItem>
              <ToolbarItem className="pf-u-mx-md">
                <Button
                  aria-label="add edge router"
                  variant="tertiary"
                  onClick={this.onSelect}
                >
                  Add Edge router
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </Toolbar>
        </PageSection>
        <PageSection variant={PageSectionVariants.light}>
          <Split gutter="md">
            <SplitItem isFilled>
              <div className="force-graph" ref={el => (this.container = el)}>
                {this.state.dimensions && (
                  <Graph
                    nodes={this.state.networkInfo.nodes}
                    links={this.state.networkInfo.links}
                    dimensions={this.state.dimensions}
                    notifyCurrentRouter={() => {}}
                  />
                )}
              </div>
            </SplitItem>
            <SplitItem>
              <TopologyContext />
            </SplitItem>
          </Split>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default ChooseTopology;
