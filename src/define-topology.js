import React from 'react';
import { PageSection, PageSectionVariants, Split, SplitItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import ShowTopology from './show-topology';
import SendersReceivers from './senders-receivers';
import ShowRouterInfo from './show-router-info';

class DefineTopology extends React.Component {
  static propTypes = {
    topology: PropTypes.string.isRequired,
    center: PropTypes.bool.isRequired,
    minRouters: PropTypes.number.isRequired,
    maxRouters: PropTypes.number.isRequired,
    defaultRouters: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      r: null, // name of the currently selected router in the svg
      routerInfo: {}, // each key is a router name. the value is an object (fields from add form)
      rows: [], // see info2Rows. Rows in the table for the current router
      edit: {}
    };
  }

  // return an array of objects which contain an array of columns and a client type
  info2Rows = info =>
    info.map(r => ({
      cells: [r.name, r.senders, r.receivers],
      client: r.client
    }));

  // get the clients info for the current router
  clients = () => {
    const clientInfo = { senders: 0, receivers: 0, edges: 0 };
    if (this.state.r) {
      const info = this.state.routerInfo[this.state.r];
      info.forEach(fields => {
        if (fields.client === 'sender') {
          clientInfo.senders += fields.senders;
        } else if (fields.client === 'receiver') {
          clientInfo.receivers += fields.receivers;
        } else if (fields.client === 'edge') {
          clientInfo.edges += fields.edges;
        }
      });
    }
    return clientInfo;
  };

  // user clicked on a specific router node in the d3 graph
  // initialize routerInfo[r] if needed and construct rows
  notifyCurrentRouter = r => {
    const { routerInfo } = this.state;
    let { rows } = this.state;
    // if we don't have any address/sender/receiver for this router
    if (Object.keys(routerInfo).indexOf(r) < 0) {
      routerInfo[r] = []; // an array of fields objects
    }
    rows = this.info2Rows(routerInfo[r]);
    this.setState({ r, routerInfo, rows });
  };

  handleDeleteRow = rowData => {
    const { routerInfo, r } = this.state;
    let { rows } = this.state;
    const info = routerInfo[r];
    const index = info.findIndex(row => row.name === rowData.cells[0] && row.client === rowData.client);
    if (index >= 0) {
      info.splice(index, 1);
      rows = this.info2Rows(info);
      this.setState({ routerInfo, rows });
    }
  };

  // user added/edited an address row to the current router
  handleSubmit = fields => {
    const { routerInfo, r, edit } = this.state;
    let { rows } = this.state;
    if (r) {
      fields.senders = fields.client === 'senders' ? fields.clients : 0;
      fields.receivers = fields.client === 'receivers' ? fields.clients : 0;

      const info = routerInfo[r];
      let index;
      if (this.state.edit.name) {
        index = info.findIndex(row => row.name === edit.name && row.client === edit.client);
      } else {
        index = info.findIndex(row => row.name === fields.name && row.client === fields.client);
      }
      if (index < 0) {
        info.push(fields);
      } else {
        info.splice(index, 1, fields);
      }
      rows = this.info2Rows(info);
      this.setState({ routerInfo, rows, edit: {} });
    }
  };

  handleCancel = () => {
    this.setState({ edit: {} });
  };

  handleEdit = rowData => {
    this.setState({ edit: { client: rowData.client, name: rowData.cells[0] } });
  };

  handleAddEdge = () => {
    console.log('handleAddEdge called');
  };

  render() {
    return (
      <PageSection variant={PageSectionVariants.light}>
        <Split gutter="md">
          <SplitItem>
            <ShowRouterInfo
              currentRouter={this.state.r}
              currentRouterInfo={this.state.routerInfo[this.state.r]}
              handleAddEdge={this.handleAddEdge}
            />
          </SplitItem>
          <SplitItem isFilled>
            <ShowTopology
              topology={this.props.topology}
              center={this.props.center}
              minRouters={this.props.minRouters}
              maxRouters={this.props.maxRouters}
              defaultRouters={this.props.defaultRouters}
              notifyCurrentRouter={this.notifyCurrentRouter}
              routerInfo={this.state.routerInfo}
            />
          </SplitItem>
          <SplitItem>
            <SendersReceivers
              currentRouter={this.state.r}
              currentRouterInfo={this.state.routerInfo[this.state.r]}
              rows={this.state.rows}
              edit={this.state.edit}
              handleSubmit={this.handleSubmit}
              handleCancel={this.handleCancel}
              handleEdit={this.handleEdit}
              handleDeleteRow={this.handleDeleteRow}
            />
          </SplitItem>
        </Split>
      </PageSection>
    );
  }
}

export default DefineTopology;
