/** TODO: Behavior tree node implementations. */
export interface BTNode {
  tick(): 'success' | 'failure' | 'running';
}

export class SelectorNode implements BTNode {
  tick(): 'success' | 'failure' | 'running' {
    return 'failure';
  }
}
