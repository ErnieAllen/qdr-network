import React from "react";
import {
  Form,
  FormGroup,
  TextInput,
  ActionGroup,
  Button
} from "@patternfly/react-core";

class TopologyContext extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.contexts = {
      interior: {
        title: "Interior router",
        fields: [{ name: "" }, { suffix: "" }, { namespace: "" }],
        actions: [{ Delete: this.handleDeleteRouter }]
      },
      edgeClass: {
        title: "Edge class",
        fields: [{ name: "" }],
        actions: [{ Delete: this.handleDeleteEdgeClass }]
      },
      edge: {
        title: "Edge router",
        fields: [{ name: "" }],
        actions: [{ Delete: this.handleDeleteEdge }]
      },
      connection: {
        title: "Connection",
        fields: [],
        actions: [
          { Delete: this.handleDeleteConnection },
          { Reverse: this.handleReverseConnections }
        ]
      }
    };
    this.handleTextInputChange1 = value1 => {
      this.setState({ value1 });
    };
    this.handleTextInputChange2 = value2 => {
      this.setState({ value2 });
    };
    this.handleTextInputChange3 = value3 => {
      this.setState({ value3 });
    };
  }

  handleDeleteRouter = () => {
    console.log("deleting router");
  };
  handleDeleteEdgeClass = () => {};
  handleDeleteEdge = () => {};
  handleDeleteConnection = () => {};
  handleReverseConnection = () => {};
  handleTextInputChange = (newVal, fieldName, key) => {
    this.props.handleEditField(newVal, fieldName, key);
  };

  render() {
    let currentContext = null;
    const currentNode = this.props.networkInfo.nodes.find(
      n => n.name === this.props.selectedNode
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
      <Form className="context-form">
        <h1>{currentContext.title}</h1>
        {currentContext.fields.map(field => {
          const fieldName = Object.keys(field)[0];
          return (
            <FormGroup
              key={fieldName}
              label={fieldName}
              isRequired
              fieldId={fieldName}
              helperText=""
            >
              <TextInput
                isRequired
                type="text"
                id={fieldName}
                name={fieldName}
                aria-describedby="simple-form-name-helper"
                value={currentNode[fieldName]}
                onChange={newVal =>
                  this.handleTextInputChange(
                    newVal,
                    fieldName,
                    currentNode.name
                  )
                }
              />
            </FormGroup>
          );
        })}
        <ActionGroup>
          {currentContext.actions.map(action => {
            const actionName = Object.keys(action)[0];
            return (
              <Button
                key={actionName}
                variant="secondary"
                onClick={action[actionName]}
              >
                {actionName}
              </Button>
            );
          })}
        </ActionGroup>
      </Form>
    );
  }
}

export default TopologyContext;
