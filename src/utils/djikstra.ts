// Utility for performing pathfinding with Djikstra's algorithm.

class Node
{
  public connections: Array<number> = [];
  public distance: number = 0;
}

export class Pathfinder
{
  nodes: Array<Node> = [];

  constructor(numNodes: number)
  {
    for (let i = 0; i < numNodes; i++)
    {
      this.nodes.push(new Node());
    }
  }

  public addBidirectionalConnection(node0: number, node1: number)
  {
    if (node0 === node1) return;
    if (!this.nodes[node0].connections.includes(node1))
      this.nodes[node0].connections.push(node1);
    if (!this.nodes[node1].connections.includes(node0))
      this.nodes[node1].connections.push(node0);
  }

  private propogateDistance(nodeIndex: number)
  {
    const thisDistance = this.nodes[nodeIndex].distance;
    let next: Array<number> = [];
    for (const connection of this.nodes[nodeIndex].connections)
    {
      const node = this.nodes[connection];
      if (node.distance > thisDistance + 1)
      {
        node.distance = thisDistance + 1;
        next.push(connection);
      }
    }
    for (const nodeIndex of next)
    {
      this.propogateDistance(nodeIndex);
    }
  }

  public setTarget(targetNode: number)
  {
    for (const node of this.nodes)
    {
      node.distance = 9e9;
    }
    this.nodes[targetNode].distance = 0;
    this.propogateDistance(targetNode);
  }

  // Must call setTarget() before calling this to specify where the algorithm
  // should try and get to from the provided starting point.
  public findRoute(startFrom: number): Array<number>
  {
    let route = [startFrom];
    let currentNode = this.nodes[startFrom];
    while (currentNode.distance > 0)
    {
      if (currentNode.distance >= 9e9)
      {
        throw new Error('There is no path from the selected node to the target.');
      }
      for (const connection of currentNode.connections)
      {
        const connectedNode = this.nodes[connection];
        if (connectedNode.distance < currentNode.distance)
        {
          route.push(connection);
          currentNode = connectedNode;
          break;
        }
      }
    }
    return route;
  }
}