import React from "react";
import { TextInput } from "@patternfly/react-core";
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant
} from "@patternfly/react-table";
import EdgeTableToolbar from "./edge-table-toolbar";
import EdgeTablePagination from "./edge-table-pagination";

class EdgeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{ title: "Name", cellFormatters: [this.formatName] }]
    };
  }

  formatName = (value, _xtraInfo) => {
    return (
      <TextInput
        value={this.props.rows[_xtraInfo.rowIndex].cells[0]}
        type="text"
        onChange={val => this.handleTextInputChange(val, _xtraInfo.rowIndex)}
        aria-label="text input example"
      />
    );
  };

  handleTextInputChange = (value, rowIndex) => {
    this.props.handleEdgeNameChange(value, rowIndex);
  };

  onSelect = (event, isSelected, rowId) => {
    this.props.handleSelectEdgeRow(rowId, isSelected);
  };

  render() {
    const { columns } = this.state;
    return (
      <React.Fragment>
        <label>Edge connectors</label>
        <EdgeTableToolbar
          handleAddEdge={this.props.handleAddEdge}
          handleDeleteEdge={this.props.handleDeleteEdge}
        />
        <Table
          variant={TableVariant.compact}
          onSelect={this.onSelect}
          cells={columns}
          rows={this.props.rows}
        >
          <TableHeader />
          <TableBody />
        </Table>
        <EdgeTablePagination />
      </React.Fragment>
    );
  }
}

export default EdgeTable;
