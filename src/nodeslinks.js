class NodesLinks {
  static nextNodeIndex = 0;
  static nextLinkIndex = 0;
  link = (s, t, i) => ({
    source: s,
    target: t,
    key: `link-${i}`,
    size: 2,
    type: "router",
    left: true,
    right: false
  });
  setLinks = (start, count) => {
    let links = [];
    for (let i = start; i < start + count - 1; i++) {
      links.push(this.link(i, i + 1, NodesLinks.nextLinkIndex++));
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

  addNode = (type, networkInfo, dimensions, selectedKey) => {
    const i = NodesLinks.nextNodeIndex++;
    const x = dimensions.width / 2;
    const y = dimensions.height / 2;
    const newNode = this.node(i, x, y);
    newNode.type = type;
    if (type === "interior") {
      newNode.name = `R${i}`;
      newNode.suffix = "";
      newNode.namespace = "";
    } else if (type === "edge") {
      const source = networkInfo.nodes.find(n => n.key === selectedKey);
      if (source) {
        newNode.x = source.x;
        newNode.y = source.y;
      }
      newNode.name = `E${i}`;
      newNode.r = 10;
    } else if (type === "edgeClass") {
      newNode.name = `EC${i}`;
      newNode.r = 6;
    }
    networkInfo.nodes.push(newNode);

    // if we added an edge, connect it to the selected edgeClass
    if (type === "edge") {
      const source = networkInfo.nodes.findIndex(n => n.key === selectedKey);
      if (source >= 0) {
        const link = this.link(
          source,
          networkInfo.nodes.length - 1,
          NodesLinks.nextLinkIndex++
        );
        link.type = "edge";
        networkInfo.links.push(link);
      }
    }
  };

  addLink = (toIndex, fromIndex, links) => {
    if (!this.linkBetween(links, toIndex, fromIndex)) {
      const link = this.link(fromIndex, toIndex, NodesLinks.nextLinkIndex++);
      links.push(link);
    }
  };

  // return true if there are any links between toIndex and fromIndex
  linkBetween = (links, toIndex, fromIndex) => {
    return links.some(
      l =>
        (l.source.index === toIndex && l.target.index === fromIndex) ||
        (l.source.index === fromIndex && l.target.index === toIndex)
    );
  };
  linkIndex = (links, nodeIndex) => {
    return links.findIndex(
      l => l.source.index === nodeIndex || l.target.index === nodeIndex
    );
  };

  setNodesLinks = (networkInfo, dimensions) => {
    const nodes = [];
    let links = [];
    const midX = dimensions.width / 2;
    const midY = dimensions.height / 2;
    const displace = dimensions.height / 2;
    // create the routers
    // set their starting positions in a circle
    if (networkInfo.routers.length === 1) {
      nodes.push(this.node(0, midX, midY));
    } else {
      this.addNodesInCircle(
        nodes,
        0,
        networkInfo.routers.length,
        midX,
        midY,
        displace
      );
    }
    if (networkInfo.routers.length > 1)
      links = this.setLinks(0, networkInfo.routers.length);
    return { nodes, links };
  };
}

export default NodesLinks;
