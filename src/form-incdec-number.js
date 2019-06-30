import React from "react";
import { TextInput } from "@patternfly/react-core";

class FormIncDecNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleAPS = val => {
    console.log(`APS ${val}`);
  };

  handleIncDec = dir => {
    console.log(`incdec ${dir}`);
  };
  render() {
    return (
      <React.Fragment>
        <div>
          <TextInput
            className="sm-input"
            type="number"
            id={this.props.id}
            name={this.props.id}
            aria-describedby={`${this.props.id}-helper`}
            value={this.props.value}
            onChange={this.props.onChange}
            isDisabled={this.props.disabled}
          />
          <span
            className={
              "incdec-label" + (this.props.disabled ? " disabled" : "")
            }
          >
            {this.props.label}
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default FormIncDecNumber;
