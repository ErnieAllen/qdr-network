import React from "react";
import { Button, ButtonVariant, TextInput } from "@patternfly/react-core";

class IncDec extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleScaleUp = () => {
    this.props.incdec("up");
  };

  handleScaleDn = () => {
    this.props.incdec("dn");
  };

  handleValueChange = event => {
    console.log("value change");
    console.log(event);
  };
  render() {
    const value = () => {
      if (this.props.isEdit) {
        return (
          <TextInput
            type="number"
            id="address"
            name="address"
            aria-describedby="address-helper"
            value={this.props.value}
            onChange={this.handleValueChange}
          />
        );
      } else {
        return this.props.value;
      }
    };
    return (
      <div className="deployment-donut table-cell">
        <div className="deployment-donut-row">
          <div className="deployment-donut-column scaling-controls fade-inline">
            {value()}
          </div>
          <div className="deployment-donut-column scaling-controls fade-inline">
            <Button
              title="Scale up"
              variant={ButtonVariant.plain}
              onClick={this.handleScaleUp}
            >
              <i className="fa fa-chevron-up" />
              <span className="sr-only">Scale up</span>
            </Button>
            <div>
              <Button
                title="Scale down"
                variant={ButtonVariant.plain}
                onClick={this.handleScaleDn}
              >
                <i className="fa fa-chevron-down" />
                <span className="sr-only">Scale down</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IncDec;
