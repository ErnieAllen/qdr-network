import React from "react";
import FieldDetails from "./field-details";

class TopologyContext extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.contexts = {
      interior: {
        title: "Interior connector",
        fields: [
          { title: "Identity", type: "text", isRequired: true },
          { title: "Route-suffix", type: "text" },
          { title: "Namespace", type: "text" },
          {
            title: "Cluster type",
            type: "radio",
            options: ["Kube", "okd", "OC 3.11", "OC 4.1", "unknown"]
          },
          {
            title: "State",
            type: "checkbox",
            options: [
              "New",
              "Ready to deploy",
              "Cluster heard from",
              "In network"
            ]
          }
        ],
        actions: [{ title: "Delete", onClick: this.props.handleDeleteRouter }]
      },
      edgeClass: {
        title: "Edge class",
        fields: [{ title: "name", type: "text", isRequired: true }],
        actions: [{ title: "Delete", onClick: this.props.handleDeleteRouter }],
        extra: { title: "Edge connectors", type: "edgeTable" }
      },
      edge: {
        title: "Edge connector",
        fields: [{ title: "name", type: "text", isRequired: true }],
        actions: [{ title: "Delete", onClick: this.props.handleDeleteRouter }]
      },
      connection: {
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
    }

    if (!currentContext) {
      return (
        <div>
          <h1>Nothing selected</h1>
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
      />
    );
  }
}

export default TopologyContext;
