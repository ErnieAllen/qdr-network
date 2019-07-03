import React from "react";

import * as d3 from "d3";
import { addDefs } from "./nodes";

class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.force = d3.layout
      .force()
      .size([this.props.dimensions.width, this.props.dimensions.height])
      .linkDistance(l => {
        if (this.props.thumbNail) return 50;
        else if (l.type === "router") return 150;
        else if (l.type === "edge") return 20;
        return 50;
      })
      .charge(-800)
      .friction(0.1)
      .gravity(0.001);

    this.mouse_down_position = null;
  }

  // called only once when the component is initialized
  componentDidMount() {
    const svg = d3.select(this.svg);
    addDefs(svg);

    this.d3Graph = d3.select(this.svgg);

    this.force.on("tick", () => {
      // after force calculation starts, call updateGraph
      // which uses d3 to manipulate the attributes,
      // and React doesn't have to go through lifecycle on each tick
      this.d3Graph.call(this.updateGraph);
    });
    // call this manually to create svg circles and lines
    this.shouldComponentUpdate(this.props);
  }

  // called each time one of the properties changes
  // in our case, the number of routers probably changed
  shouldComponentUpdate(nextProps) {
    this.d3Graph = d3.select(this.svgg);

    const d3Nodes = this.d3Graph
      .selectAll(".node")
      .data(nextProps.nodes, node => node.key);
    d3Nodes
      .enter()
      .append("g")
      .call(this.enterNode);
    d3Nodes.exit().remove();
    d3Nodes.call(this.updateNode);
    d3Nodes.call(this.force.drag);

    const d3Links = this.d3Graph
      .selectAll(".link")
      .data(nextProps.links, link => link.key);
    d3Links
      .enter()
      .insert("line", ".node")
      .call(this.enterLink);
    d3Links.exit().remove();
    d3Links.call(this.updateLink);

    // we should actually clone the nodes and links
    // since we're not supposed to directly mutate
    // props passed in from parent, and d3's force function
    // mutates the nodes and links array directly
    this.force.nodes(nextProps.nodes).links(nextProps.links);
    this.force.start();

    return false;
  }

  enterNode = selection => {
    const graph = this;
    selection.append("circle").attr("r", d => {
      return d.r ? d.r : d.size;
    });

    selection.classed("node", true);

    if (!this.props.thumbNail) {
      selection
        .append("text")
        .attr("x", d => d.size + 5)
        .attr("dy", ".35em")
        .text(d => d.name);
    }

    const sqr2o2 = Math.sqrt(2.0) / 2.0;
    const points = `1 0 ${sqr2o2} ${sqr2o2} 0 1 -${sqr2o2} ${sqr2o2} -1 0 -${sqr2o2} -${sqr2o2} 0 -1 ${sqr2o2} -${sqr2o2}`;
    selection
      .filter(d => d.type === "edgeClass")
      .append("polygon")
      .attr("points", points)
      .attr("transform", `scale(60) rotate(22.5)`);

    selection
      .on("mouseover", function(n) {
        n.over = true;
        graph.updateNode(d3.select(this));
      })
      .on("mouseout", function(n) {
        n.over = false;
        graph.updateNode(d3.select(this));
      })
      .on("click", function(n) {
        // if there was a selected node and it was not the one we just clicked on:
        // create a link between the selected node and the clicked on node
        if (graph.props.selectedKey && graph.props.selectedKey !== n.key) {
          graph.props.notifyCreateLink(n.key, graph.props.selectedKey);
        }

        // see if the node was dragged (same === false)
        const same = graph.samePos(
          d3.mouse(this.parentNode),
          graph.mouse_down_position
        );
        if (graph.props.selectedKey === n.key && same) {
          graph.props.notifyCurrentRouter(null);
        } else {
          graph.props.notifyCurrentRouter(n.key);
        }
        graph.refresh();
      })
      .on("mousedown", function(n) {
        graph.mouse_down_position = d3.mouse(this.parentNode);
      })
      .on("mouseup", n => {
        if (n.type !== "edge") n.fixed = true;
      });

    this.refresh();
  };

  samePos = (pos1, pos2) => {
    if (pos1 && pos2) {
      if (pos1[0] === pos2[0] && pos1[1] === pos2[1]) return true;
    }
    return false;
  };
  refresh = () => {
    const circles = d3.selectAll("g.node");
    circles
      .classed("selected", d => d.key === this.props.selectedKey)
      .classed("edgeClass", d => d.type === "edgeClass")
      .classed("edge", d => d.type === "edge")
      .classed("interior", d => d.type === "interior");

    d3.selectAll("svg text").each(function(d) {
      d3.select(this).text(d.name);
    });
  };

  updateNode = selection => {
    selection.attr("transform", d => {
      let r = 15;
      d.x = Math.max(Math.min(d.x, this.props.dimensions.width - r), r);
      d.y = Math.max(Math.min(d.y, this.props.dimensions.height - r), r);
      return `translate(${d.x || 0},${d.y || 0}) ${d.over ? "scale(1.1)" : ""}`;
    });
  };

  markerId = (link, end) => {
    return `--${end === "end" ? link.size : link.size}`;
  };

  enterLink = selection => {
    selection
      .classed("link", true)
      .attr("stroke-width", d => d.size)
      .attr("marker-end", d => {
        return d.right ? `url(#end--20)` : null;
      })
      .attr("marker-start", d => {
        if (d.type === "edge") return null;
        if (this.props.thumbNail) return null;
        return d.left || (!d.left && !d.right) ? `url(#start--20)` : null;
      });
  };

  updateLink = selection => {
    selection
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  };

  updateGraph = selection => {
    selection.selectAll(".node").call(this.updateNode);
    selection.selectAll(".link").call(this.updateLink);
  };

  render() {
    const { width, height } = this.props.dimensions;
    const cloudXScale = this.props.thumbNail ? 0 : 13;
    return (
      <React.Fragment>
        <svg
          width={width}
          height={height}
          ref={el => (this.svg = el)}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform={`scale(${cloudXScale}, 8)`}>
            <path
              className="cloud-outline"
              d="m 10,20 C 5,10 10,5 20,10 C 25,0 35,0 40,10 C 45,0 60,0 65,10 C 70,0 85,0 90,10 C 100,5 105,10 100,20 C 110,25 110,35 100,40 C 110,45 110,55 100,60 C 105,70 100,75 90,70 C 85,80 75,80 70,70 C 65,80 50,80 45,70 C 40,80 25,80 20,70 C 10,75 5,70 10,60 C 0,55 0,45 10,40 C 0,35 0,25 10,20 z"
            />
          </g>
          <g ref={el => (this.svgg = el)} />
        </svg>
      </React.Fragment>
    );
  }
}

export default Graph;
