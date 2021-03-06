import React from "react";
import {
  Title,
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";

class EmptyEdgeClassTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h5" size="lg">
          No edge routers
        </Title>
        <EmptyStateBody>
          This edge class does not contain any edge routers yet.
        </EmptyStateBody>
        <EmptyStateSecondaryActions>
          <Button
            variant="primary"
            aria-label="Add"
            onClick={this.props.handleAddEdge}
          >
            Add an edge router
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    );
  }
}

export default EmptyEdgeClassTable;
