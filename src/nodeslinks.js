class NodesLinks {
  link = (s, t) => ({
    source: s,
    target: t,
    key: `${s}:${t}`,
    size: 2,
    type: "router",
    left: true,
    right: false
  });
  setLinks = (start, count) => {
    let links = [];
    for (let i = start; i < start + count - 1; i++) {
      links.push(this.link(i, i + 1));
    }
    return links;
  };

  node = (i, x, y) => ({
    key: `key_${i}`,
    name: `R${i}`,
    val: i,
    size: 15,
    r: 20,
    x: x,
    y: y
  });

  getXY = (start, count, midX, midY, rotate, displace) => {
    const ang = (start * 2.0 * Math.PI) / count + rotate;
    const x = midX + Math.cos(ang) * displace;
    const y = midY + Math.sin(ang) * displace;
    return { x, y };
  };

  addNodesInCircle = (nodes, start, count, midX, midY, displace, rotate) => {
    rotate = rotate || 0;
    for (let i = start; i < start + count; i++) {
      const { x, y } = this.getXY(
        i - start,
        count,
        midX,
        midY,
        rotate,
        displace
      );
      nodes.push(this.node(i, x, y));
    }
  };
  setNodesLinks = (networkInfo, dimensions) => {
    const nodes = [];
    let links = [];
    const midX = dimensions.width / 2;
    const midY = dimensions.height / 2;
    const displace = dimensions.height / 2;
    // create the routers
    // set their starting positions in a circle
    if (networkInfo.routers === 1) {
      nodes.push(this.node(0, midX, midY));
    } else {
      this.addNodesInCircle(
        nodes,
        0,
        networkInfo.routers,
        midX,
        midY,
        displace
      );
    }
    if (networkInfo.routers > 1) links = this.setLinks(0, networkInfo.routers);
    return { nodes: nodes, links: links };
  };
}

export default NodesLinks;
