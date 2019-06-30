import React from 'react';
import { Modal, Button } from '@patternfly/react-core';
import AddAddressForm from './add-address-form';

class AddAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      name: 'my_address',
      clients: 1,
      aps: 1,
      spa: 1,
      startat: 1,
      messages: 1000,
      msize: 1000,
      throttle: 0
    };
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.edit && !this.state.isModalOpen) {
      const info = nextProps.currentRouterInfo.filter(
        r => r.client === nextProps.whichEdit.client && r.name === nextProps.whichEdit.name
      )[0];

      this.setState({
        isModalOpen: true,
        name: info.name,
        clients: info.clients,
        aps: info.aps,
        spa: info.spa,
        startat: info.startat,
        messages: info.messages,
        msize: info.msize,
        throttle: info.throttle
      });
    }
    return true;
  };

  handleModalToggle = submit => {
    if (submit) {
      const clone = JSON.parse(JSON.stringify(this.state));
      clone.client = this.props.client;
      this.props.handleSubmit(clone);
    }
    this.props.handleCancel();
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen
    }));
  };

  handleNameChange = name => {
    this.setState({ name });
  };

  handleClientsChange = clients => {
    clients = Math.max(clients, 1);
    this.setState({ clients });
  };

  handleAPS = aps => {
    aps = Math.max(aps, 1);
    this.setState({ aps });
  };

  handleSPA = spa => {
    spa = Math.max(spa, 1);
    this.setState({ spa });
  };

  handleStartAt = startat => {
    startat = Math.max(startat, 1);
    this.setState({ startat });
  };

  handleMessageSize = msize => {
    msize = Math.max(msize, 1);
    this.setState({ msize });
  };

  handleMessages = messages => {
    messages = Math.max(messages, 1);
    this.setState({ messages });
  };

  handleThrottle = throttle => {
    throttle = Math.max(throttle, 0);
    this.setState({ throttle });
  };

  render() {
    const { isModalOpen } = this.state;
    const { client } = this.props; // senders or receivers

    return (
      <React.Fragment>
        <Button variant="primary" onClick={() => this.handleModalToggle(false)}>
          Add {client}
        </Button>
        <Modal
          isSmall
          title={`${this.props.edit ? 'Edit' : 'Add'} ${client}`}
          isOpen={isModalOpen}
          onClose={() => this.handleModalToggle(false)}
          actions={[
            <Button key="cancel" variant="secondary" onClick={() => this.handleModalToggle(false)}>
              Cancel
            </Button>,
            <Button key="confirm" variant="primary" onClick={() => this.handleModalToggle(true)}>
              Confirm
            </Button>
          ]}
        >
          <AddAddressForm
            client={client}
            name={this.state.name}
            clients={this.state.clients}
            aps={this.state.aps}
            spa={this.state.spa}
            startat={this.state.startat}
            msize={this.state.msize}
            messages={this.state.messages}
            throttle={this.state.throttle}
            handleNameChange={this.handleNameChange}
            handleClientsChange={this.handleClientsChange}
            handleAPS={this.handleAPS}
            handleSPA={this.handleSPA}
            handleStartAt={this.handleStartAt}
            handleMessageSize={this.handleMessageSize}
            handleMessages={this.handleMessages}
            handleThrottle={this.handleThrottle}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default AddAddress;
