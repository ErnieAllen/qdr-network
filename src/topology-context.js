import React from "react";
import FieldDetails from "./field-details";
import { RouterStates } from "./nodes";
import EmptySelection from "./empty-selection";

class TopologyContext extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.contexts = {
      interior: {
        title: "Cluster connector",
        fields: [
          { title: "Name", type: "text", isRequired: true },
          { title: "Route-suffix", type: "text" },
          { title: "Namespace", type: "text" },
          {
            title: "Cluster type",
            type: "radio",
            options: ["Kube", "okd", "OC 3.11", "OC 4.1", "unknown"]
          },
          {
            title: "State",
            type: "states",
            options: RouterStates
          }
        ],
        actions: [{ title: "Delete", onClick: this.props.handleDeleteRouter }]
      },
      edgeClass: {
        title: "Edge class",
        fields: [{ title: "name", type: "text", isRequired: true }],
        actions: [{ title: "Delete", onClick: this.props.handleDeleteRouter }],
        extra: { title: "Edge routers", type: "edgeTable" }
      },
      edge: {
        title: "Edge router",
        fields: [{ title: "name", type: "text", isRequired: true }],
        actions: [{ title: "Delete", onClick: this.props.handleDeleteRouter }]
      },
      connector: {
        title: "Connection",
        fields: [],
        actions: [
          { title: "Delete", onClick: this.handleDeleteConnection },
          { title: "Reverse", onClick: this.handleReverseConnections }
        ]
      }
    };
  }

  handleDeleteEdgeClass = () => {};
  handleDeleteEdge = () => {};
  handleDeleteConnection = () => {};
  handleReverseConnection = () => {};

  render() {
    let currentContext = null;
    const currentNode = this.props.networkInfo.nodes.find(
      n => n.key === this.props.selectedKey
    );
    if (currentNode) {
      currentContext = this.contexts[currentNode.type];
    } else {
      const currentLink = this.props.networkInfo.links.find(
        l => l.key === this.props.selectedKey
      );
      if (currentLink) currentContext = this.contexts[currentLink.type];
    }

    if (!currentContext) {
      return (
        <div>
          <EmptySelection />
        </div>
      );
    }
    return (
      <FieldDetails
        details={currentContext}
        networkInfo={this.props.networkInfo}
        selectedKey={this.props.selectedKey}
        handleEditField={this.props.handleEditField}
        handleAddEdge={this.props.handleAddEdge}
        handleDeleteEdge={this.props.handleDeleteEdge}
        handleEdgeNameChange={this.props.handleEdgeNameChange}
        handleSelectEdgeRow={this.props.handleSelectEdgeRow}
        handleRadioChange={this.props.handleRadioChange}
      />
    );
  }
}

export default TopologyContext;
