import {Tree, TREE_MOVE_MODES, TREE_TRAVERSE_MODES} from '../../src/index';


  const TREE = [
    {id: 1},
    {
      id: 2,
      children: [
        {id: 21},
        {id: 22}
      ]
    },
    {
      id: 3,
      children: [
        {id: 31},
        {id: 32},
        {
          id: 33, children: [
            {id: 331}
          ]
        }
      ]
    }
  ];

  const TREE_PARENT = [
    {id: 1, parent: null},
    {id: 2, parent: null},
    {id: 3, parent: null},
    {id: 21, parent: 2},
    {id: 22, parent: 2},
    {id: 31, parent: 3},
    {id: 32, parent: 3},
    {id: 33, parent: 3},
    {id: 331, parent: 33}
  ];

  it('should return a default instance', function() {
    const tree = Tree(TREE, {deepCopy: true});
    expect(tree).not.toBe(TREE);
    expect(Array.isArray(tree)).toBe(true);
    expect(typeof tree.getNode).toBe('function');
    expect(tree[0].id).toEqual(1);
  });

  it('should gives tree data in parent stucture', function() {
    const tree = Tree(TREE, {deepCopy: true});
    const t = tree.toParentStructure();
    expect(t).toEqual(TREE_PARENT);
  });

  it('should create a tree instance from parent structure', function() {
    const t = Tree.fromParentStructure(TREE_PARENT);
    expect(t).toEqual(TREE);
  });

  it('should traverse correctly in pre-order mode', function() {
    const tree = Tree(TREE, {deepCopy: true});
    const ids = [];
    for (let node of tree.nodes(TREE_TRAVERSE_MODES.PRE_ORDER)) {
      ids.push(node.id);
    }
    expect(ids).toEqual([1, 2, 21, 22, 3, 31, 32, 33, 331]);
  });

  it('should traverse correctly in post-order mode', function() {
    const tree = Tree(TREE, {deepCopy: true});
    const ids = [];
    for (let node of tree.nodes(TREE_TRAVERSE_MODES.POST_ORDER)) {
      ids.push(node.id);
    }
    expect(ids).toEqual([1, 21, 22, 2, 31, 32, 331, 33, 3]);
  });

  it('should traverse correctly in breadth first mode', function() {
    const tree = Tree(TREE, {deepCopy: true});
    const ids = [];
    for (let node of tree.nodes(TREE_TRAVERSE_MODES.BREATH_FIRST)) {
      ids.push(node.id);
    }
    expect(ids).toEqual([1, 2, 3, 21, 22, 31, 32, 33, 331]);
  });

  it('should have working getters', function() {
    const tree = Tree(TREE, {deepCopy: true});
    const n = tree.getNode(33);
    expect(n.id).toEqual(33);
    expect(Array.isArray(n.children)).toBe(true);
    expect(tree.getDepth(n)).toEqual(2);
    expect(tree.getDepth(33)).toEqual(2);
    expect(tree.getParent(n).id).toEqual(3);
    expect(tree.getParent(33).id).toEqual(3);
    expect(tree.getParent(1)).toEqual(null);
    expect(tree.getAncestors(n)).toEqual([3]);
    expect(tree.getAncestors(33)).toEqual([3]);
  });

  it('should gives valid children status', function() {
    const tree = Tree(TREE, {deepCopy: true});
    expect(tree.hasChildren(1)).toEqual(false);
    expect(tree.hasChildren(2)).toEqual(true);
    expect(tree.hasChildren(331)).toEqual(false);
    expect(tree.hasChildren(33)).toEqual(true);
  });

  it('should gives valid sibling status', function() {
    const tree = Tree(TREE, {deepCopy: true});
    expect(tree.hasSibling(1)).toEqual(true);
    expect(tree.hasSibling(2)).toEqual(true);
    expect(tree.hasSibling(3)).toEqual(true);
    expect(tree.hasSibling(21)).toEqual(true);
    expect(tree.hasSibling(22)).toEqual(true);
    expect(tree.hasSibling(33)).toEqual(true);
    expect(tree.hasSibling(331)).toEqual(false);

    expect(tree.hasYoungerSibling(1)).toEqual(true);
    expect(tree.hasYoungerSibling(2)).toEqual(true);
    expect(tree.hasYoungerSibling(3)).toEqual(false);
    expect(tree.hasYoungerSibling(21)).toEqual(true);
    expect(tree.hasYoungerSibling(22)).toEqual(false);
    expect(tree.hasYoungerSibling(33)).toEqual(false);
    expect(tree.hasYoungerSibling(331)).toEqual(false);

    expect(tree.hasOlderSibling(1)).toEqual(false);
    expect(tree.hasOlderSibling(2)).toEqual(true);
    expect(tree.hasOlderSibling(3)).toEqual(true);
    expect(tree.hasOlderSibling(21)).toEqual(false);
    expect(tree.hasOlderSibling(22)).toEqual(true);
    expect(tree.hasOlderSibling(33)).toEqual(true);
    expect(tree.hasOlderSibling(331)).toEqual(false);
  });

  it('should append and prepend nodes', function() {
    const tree = Tree(TREE, {deepCopy: true});
    tree.appendNode({id: 34}, 3);
    expect(tree[2].children[3]).toEqual({id: 34});
    tree.prependNode({id: 330}, 33);
    expect(tree[2].children[2].children[0]).toEqual({id: 330});
  });

  it('should append and prepend root nodes', function() {
    const tree = Tree(TREE, {deepCopy: true});
    tree.appendNode({id: 4});
    expect(tree[0].id).toEqual(1);
    expect(tree[3].id).toEqual(4);
    tree.prependNode({id: 0});
    expect(tree[0].id).toEqual(0);
    expect(tree[1].id).toEqual(1);
    expect(tree[4].id).toEqual(4);
  });

  it('should remove nodes', function() {
    const tree = Tree(TREE, {deepCopy: true});
    tree.removeNode(33);
    expect(tree[2].children).toEqual([{id: 31}, {id: 32}]);
    tree.removeNode(2);
    tree.removeNode(3);
    expect(tree).toEqual([{id: 1}]);
    tree.removeNode(1);
    expect(tree).toEqual([]);
  });

  it('should not move ancestor nodes into child node', function() {
    const tree = Tree(TREE, {deepCopy: true});
    tree.moveNode(3, 31, TREE_MOVE_MODES.AFTER);
    expect(tree).toEqual(TREE);
  });

  it('should move nodes in "after" mode', function() {
    const tree = Tree(TREE, {deepCopy: true});
    tree.moveNode(22, 21, TREE_MOVE_MODES.AFTER);
    expect(tree).toEqual([
      {id: 1},
      {
        id: 2, children: [
          {id: 21},
          {id: 22}
        ]
      },
      {
        id: 3,
        children: [
          {id: 31},
          {id: 32},
          {
            id: 33, children: [
              {id: 331}
            ]
          }
        ]
      }
    ]);

    tree.moveNode(21, 22, TREE_MOVE_MODES.AFTER);
    expect(tree).toEqual([
      {id: 1},
      {
        id: 2, children: [
          {id: 22},
          {id: 21}
        ]
      },
      {
        id: 3,
        children: [
          {id: 31},
          {id: 32},
          {
            id: 33, children: [
              {id: 331}
            ]
          }
        ]
      }
    ]);

    tree.moveNode(33, 21, TREE_MOVE_MODES.AFTER);
    expect(tree).toEqual([
      {id: 1},
      {
        id: 2, children: [
          {id: 22},
          {id: 21},
          {
            id: 33, children: [
              {id: 331}
            ]
          }
        ]
      },
      {
        id: 3,
        children: [
          {id: 31},
          {id: 32}
        ]
      }
    ]);
  });

  it('should move nodes in "before" mode', function() {
    const tree = Tree(TREE, {deepCopy: true});
    tree.moveNode(21, 22, TREE_MOVE_MODES.BEFORE);
    expect(tree).toEqual([
      {id: 1},
      {
        id: 2, children: [
          {id: 21},
          {id: 22}
        ]
      },
      {
        id: 3,
        children: [
          {id: 31},
          {id: 32},
          {
            id: 33, children: [
              {id: 331}
            ]
          }
        ]
      }
    ]);

    tree.moveNode(22, 21, TREE_MOVE_MODES.BEFORE);
    expect(tree).toEqual([
      {id: 1},
      {
        id: 2, children: [
          {id: 22},
          {id: 21}
        ]
      },
      {
        id: 3,
        children: [
          {id: 31},
          {id: 32},
          {
            id: 33, children: [
              {id: 331}
            ]
          }
        ]
      }
    ]);

    tree.moveNode(33, 22, TREE_MOVE_MODES.BEFORE);
    expect(tree).toEqual([
      {id: 1},
      {
        id: 2,
        children: [
          {
            id: 33, children: [
              {id: 331}
            ]
          },
          {id: 22},
          {id: 21}
        ]
      },
      {
        id: 3, children: [
          {id: 31},
          {id: 32}
        ]
      }
    ]);
  });

  it('should move nodes in "child" mode', function() {
    const tree = Tree(TREE, {deepCopy: true});
    tree.moveNode(33, 22, TREE_MOVE_MODES.CHILD);
    expect(tree).toEqual([
      {id: 1},
      {
        id: 2,
        children: [
          {id: 21},
          {
            id: 22, children: [
              {
                id: 33,
                children: [
                  {id: 331}
                ]
              }
            ]
          }
        ]
      },
      {
        id: 3, children: [
          {id: 31},
          {id: 32}
        ]
      }
    ]);
  });

  it('should move root nodes', function() {
    const tree = Tree(TREE, {deepCopy: true});
    tree.moveNode(1, 2, TREE_MOVE_MODES.AFTER);
    expect(tree).toEqual([
      {
        id: 2,
        children: [
          {id: 21},
          {id: 22}
        ]
      },
      {id: 1},
      {
        id: 3,
        children: [
          {id: 31},
          {id: 32},
          {
            id: 33, children: [
              {id: 331}
            ]
          }
        ]
      }
    ]);
  });

