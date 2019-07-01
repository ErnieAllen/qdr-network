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
      selectedKey: null
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
    const { networkInfo, dimensions, selectedKey } = this.state;
    this.nodesLinks.addNode("interior", networkInfo, dimensions, selectedKey);
    this.setState({ networkInfo });
  };

  handleAddEdgeClass = () => {
    const { networkInfo, dimensions, selectedKey } = this.state;
    this.nodesLinks.addNode("edgeClass", networkInfo, dimensions, selectedKey);
    this.setState({ networkInfo });
  };

  handleAddEdge = () => {
    const { networkInfo, dimensions, selectedKey } = this.state;
    this.nodesLinks.addNode("edge", networkInfo, dimensions, selectedKey);
    this.setState({ networkInfo });
  };

  handleEditField = (newVal, fieldName, key) => {
    const { networkInfo } = this.state;
    const currentNode = networkInfo.nodes.find(n => n.key === key);
    if (currentNode) {
      currentNode[fieldName] = newVal;
      this.setState({ networkInfo });
    }
  };

  handleDeleteRouter = () => {
    const { networkInfo } = this.state;
    let { selectedKey } = this.state;
    const nodeIndex = networkInfo.nodes.findIndex(n => n.key === selectedKey);
    if (nodeIndex >= 0) {
      // remove all links
      let linkIndex = this.nodesLinks.linkIndex(networkInfo.links, nodeIndex);
      while (linkIndex >= 0) {
        networkInfo.links.splice(linkIndex, 1);
        linkIndex = this.nodesLinks.linkIndex(networkInfo.links, nodeIndex);
      }
      // if this routers was selected, unselect it
      if (networkInfo.nodes[nodeIndex].key === selectedKey) {
        selectedKey = null;
      }
      // remove the router
      networkInfo.nodes.splice(nodeIndex, 1);
      this.setState({ networkInfo, selectedKey });
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

  notifyCurrentRouter = selectedKey => {
    this.setState({ selectedKey });
  };

  notifyCreateLink = (to, from) => {
    const { networkInfo } = this.state;
    const toIndex = networkInfo.nodes.findIndex(n => n.key === to);
    const fromIndex = networkInfo.nodes.findIndex(n => n.key === from);
    if (toIndex >= 0 && fromIndex >= 0) {
      if (
        networkInfo.nodes[toIndex].type === "interior" &&
        networkInfo.nodes[fromIndex].type !== "edge"
      ) {
        this.nodesLinks.addLink(fromIndex, toIndex, networkInfo.links);
        this.setState({ networkInfo });
      }
    }
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
                    notifyCreateLink={this.notifyCreateLink}
                    selectedKey={this.state.selectedKey}
                  />
                )}
              </div>
            </SplitItem>
            <SplitItem className="context-form">
              <TopologyContext
                selectedKey={this.state.selectedKey}
                networkInfo={this.state.networkInfo}
                handleEditField={this.handleEditField}
                handleDeleteRouter={this.handleDeleteRouter}
                handleAddEdge={this.handleAddEdge}
              />
            </SplitItem>
          </Split>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default ChooseTopology;
