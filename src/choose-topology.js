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
      networkInfo: { name: "network name", nodes: [], links: [] },
      dimensions: null,
      selectedNode: null
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
    const { networkInfo, dimensions } = this.state;
    this.nodesLinks.addNode("interior", networkInfo, dimensions);
    this.setState({ networkInfo });
  };

  handleAddEdgeClass = () => {
    const { networkInfo, dimensions } = this.state;
    this.nodesLinks.addNode("edgeClass", networkInfo, dimensions);
    this.setState({ networkInfo });
  };

  handleAddEdge = () => {
    const { networkInfo, dimensions } = this.state;
    this.nodesLinks.addNode("edge", networkInfo, dimensions);
    this.setState({ networkInfo });
  };

  handleEditField = (newVal, fieldName, key) => {
    const { networkInfo } = this.state;
    let { selectedNode } = this.state;
    const currentNode = networkInfo.nodes.find(n => n.name === key);
    if (currentNode) {
      currentNode[fieldName] = newVal;
      if (fieldName === "name") {
        selectedNode = newVal;
      }
      this.setState({ networkInfo, selectedNode });
    }
  };

  updateNodesLinks = networkInfo => {
    const { nodes, links } = this.nodesLinks.setNodesLinks(
      networkInfo,
      this.state.dimensions
    );
    networkInfo.nodes = nodes;
    networkInfo.links = links;
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

  notifyCurrentRouter = selectedNode => {
    this.setState({ selectedNode });
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
                <Button
                  aria-label="add edge class"
                  variant="tertiary"
                  onClick={this.handleAddEdgeClass}
                >
                  Add Edge class
                </Button>
              </ToolbarItem>
              <ToolbarItem className="pf-u-mx-md">
                <Button
                  aria-label="add edge router"
                  variant="tertiary"
                  onClick={this.handleAddEdge}
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
                    notifyCurrentRouter={this.notifyCurrentRouter}
                  />
                )}
              </div>
            </SplitItem>
            <SplitItem className="context-form">
              <TopologyContext
                selectedNode={this.state.selectedNode}
                networkInfo={this.state.networkInfo}
                handleEditField={this.handleEditField}
              />
            </SplitItem>
          </Split>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default ChooseTopology;
