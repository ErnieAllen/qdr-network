import React from "react";
import {
  Form,
  FormGroup,
  TextInput,
  Button,
  Radio
} from "@patternfly/react-core";
import EdgeTable from "./edge-table";
import Graph from "./graph";

class FieldDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formElement = (field, currentNode) => {
    if (field.type === "text") {
      return (
        <TextInput
          isRequired={field.isRequired}
          type="text"
          id={field.title}
          name={field.title}
          aria-describedby="simple-form-name-helper"
          value={currentNode[field.title]}
          onChange={newVal =>
            this.props.handleEditField(newVal, field.title, currentNode.key)
          }
        />
      );
    }
    if (field.type === "radio") {
      const currentNode = this.props.networkInfo.nodes.find(
        n => n.key === this.props.selectedKey
      );
      return field.options.map((o, i) => {
        return (
          <Radio
            key={`key-radio-${o}-${i}`}
            id={o}
            value={o}
            name={field.title}
            label={o}
            aria-label={o}
            onChange={() => this.props.handleRadioChange(o, field.title)}
            isChecked={currentNode[field.title] === o}
          />
        );
      });
    }
    if (field.type === "states") {
      return field.options.map((o, i) => {
        return (
          <div
            className="pf-c-check"
            key={`key-checkbox-${o}-${i}`}
            id={`${field.title}-${i}`}
          >
            <label className="pf-c-check__label" htmlFor={`State-${i}`}>
              <span>
                <Graph
                  id={`State-${i}`}
                  thumbNail={true}
                  legend={true}
                  dimensions={{ width: 30, height: 30 }}
                  nodes={[
                    {
                      key: `legend-key-${i}`,
                      r: 10,
                      type: "interior",
                      state: i
                    }
                  ]}
                  links={[]}
                  notifyCurrentRouter={() => {}}
                />
                {o}
              </span>
            </label>
          </div>
        );
      });
    }
  };

  extra = currentNode => {
    if (this.props.details.extra) {
      const currentNode = this.props.networkInfo.nodes.find(
        n => n.key === this.props.selectedKey
      );
      return (
        <EdgeTable
          rows={currentNode.rows}
          handleAddEdge={this.props.handleAddEdge}
          handleDeleteEdge={this.props.handleDeleteEdge}
          handleEdgeNameChange={this.props.handleEdgeNameChange}
          handleSelectEdgeRow={this.props.handleSelectEdgeRow}
        />
      );
    }
  };

  render() {
    const currentNode = this.props.networkInfo.nodes.find(
      n => n.key === this.props.selectedKey
    );
    return (
      <Form>
        <h1>{this.props.details.title}</h1>
        <FormGroup fieldId="actions">
          {this.props.details.actions.map(action => {
            return (
              <Button
                key={action.title}
                variant="secondary"
                onClick={action.onClick}
              >
                {action.title}
              </Button>
            );
          })}
        </FormGroup>
        {this.props.details.fields.map(field => {
          return (
            <FormGroup
              key={field.title}
              label={field.title}
              isRequired={field.isRequired}
              fieldId={field.title}
              helperText={field.help}
              isInline={field.type === "radio"}
            >
              {this.formElement(field, currentNode)}
            </FormGroup>
          );
        })}
        <FormGroup fieldId="extra">{this.extra(currentNode)}</FormGroup>
      </Form>
    );
  }
}

export default FieldDetails;
