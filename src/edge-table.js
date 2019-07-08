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
import EmptyEdgeClassTable from "./empty-edge-class-table";

class EdgeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{ title: "Name", cellFormatters: [this.formatName] }],
      filterText: "",
      sortDown: true
    };
  }

  formatName = (value, _xtraInfo) => {
    console.log("formatName");
    console.log(value);
    console.log(_xtraInfo);
    console.log(this.props.rows[_xtraInfo.rowIndex].cells[0]);
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

  toggleAlphaSort = () => {
    this.setState({ sortDown: !this.state.sortDown });
  };

  genTable = () => {
    console.log("regenning table");
    const { columns, filterText } = this.state;
    if (this.props.rows.length > 0) {
      let rows = this.props.rows.map(r => ({ cells: [r.cells[0]] }));
      // sort the rows
      //rows = rows.sort((a, b) =>
      //  a.cells[0] < b.cells[0] ? -1 : a.cells[0] > b.cells[0] ? 1 : 0
      //);
      //if (!this.state.sortDown) {
      //  rows = rows.reverse();
      //}
      // filter the rows
      if (filterText !== "") {
        rows = rows.filter(r => r.cells[0].indexOf(filterText) >= 0);
      }
      // only show to 5
      rows = rows.slice(0, 5);
      console.log(rows);
      return (
        <React.Fragment>
          <Table
            variant={TableVariant.compact}
            onSelect={this.onSelect}
            cells={columns}
            rows={rows}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </React.Fragment>
      );
    }
    return <EmptyEdgeClassTable handleAddEdge={this.props.handleAddEdge} />;
  };

  handleChangeFilter = filterText => {
    this.setState({ filterText });
  };

  genToolbar = () => {
    if (this.props.rows.length > 0) {
      return (
        <React.Fragment>
          <label>Edge routers</label>
          <EdgeTableToolbar
            handleAddEdge={this.props.handleAddEdge}
            handleDeleteEdge={this.props.handleDeleteEdge}
            handleChangeFilter={this.handleChangeFilter}
            toggleAlphaSort={this.toggleAlphaSort}
            filterText={this.state.filterText}
            sortDown={this.state.sortDown}
          />
        </React.Fragment>
      );
    }
  };

  genPagination = () => {
    if (this.props.rows.length > 0) {
      return <EdgeTablePagination />;
    }
  };
  render() {
    return (
      <React.Fragment>
        {this.genToolbar()}
        {this.genTable()}
        {this.genPagination()}
      </React.Fragment>
    );
  }
}

export default EdgeTable;
