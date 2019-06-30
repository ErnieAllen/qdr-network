import React from 'react';
import { Form, FormGroup, Split, SplitItem, TextInput } from '@patternfly/react-core';
import FormIncDecNumber from './form-incdec-number';

class AddAddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPercent: false
    };
  }

  handleNameChange = name => {
    this.setState({ hasPercent: name.indexOf('%d') >= 0 });
    this.props.handleNameChange(name);
  };

  Capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
  Singular = str => str.slice(0, str.length - 1);

  render() {
    return (
      <Form>
        <Split gutter="md">
          <SplitItem isFilled>
            <FormGroup label="Address" isRequired fieldId="address" helperText="Insert %d to create multiple addresses">
              <TextInput
                isRequired
                type="text"
                id="address"
                name="address"
                aria-describedby="address-helper"
                value={this.props.name}
                onChange={this.handleNameChange}
              />
            </FormGroup>
          </SplitItem>
          <SplitItem>
            <FormGroup
              label={this.Capitalize(this.props.client)}
              isRequired
              fieldId={this.props.client}
              helperText={`Number of ${this.props.client}`}
            >
              <TextInput
                isRequired
                type="number"
                id={this.props.client}
                name={this.props.client}
                aria-describedby={`{this.props.client}-helper`}
                value={this.props.clients}
                onChange={this.props.handleClientsChange}
              />
            </FormGroup>
          </SplitItem>
        </Split>
        <div className="form-sub-group">
          <FormIncDecNumber
            label={`Addresses per ${this.Singular(this.props.client)}`}
            id="aps"
            onChange={this.props.handleAPS}
            value={this.props.aps}
            disabled={!this.state.hasPercent}
          />
          <FormIncDecNumber
            label={`${this.Capitalize(this.props.client)} per address`}
            id="spa"
            onChange={this.props.handleSPA}
            value={this.props.spa}
            disabled={!this.state.hasPercent}
          />
          <FormIncDecNumber
            label="Start at"
            id="startat"
            onChange={this.props.handleStartAt}
            value={this.props.startat}
            disabled={!this.state.hasPercent}
          />
        </div>
        <Split gutter="md" className={`messages-${this.props.client}`}>
          <SplitItem>
            <FormIncDecNumber
              label="Messages"
              id="messages"
              onChange={this.props.handleMessages}
              value={this.props.messages}
              disabled={false}
            />
          </SplitItem>
          <SplitItem>
            <FormIncDecNumber
              label="Message size"
              id="msize"
              onChange={this.props.handleMessageSize}
              value={this.props.msize}
              disabled={false}
            />
          </SplitItem>
        </Split>
        <FormIncDecNumber
          label="Throttle"
          id="throttle"
          onChange={this.props.handleThrottle}
          value={this.props.throttle}
          disabled={false}
        />
      </Form>
    );
  }
}

export default AddAddressForm;
