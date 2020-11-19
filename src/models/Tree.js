//TODO check efficiently for id collision
//TODO check efficiently for cycles

import {Enum} from './Enum.js';

export const TREE_TRAVERSE_MODES = Enum({
  PRE_ORDER: 'pre-order',  //root, children
  POST_ORDER: 'post-order', //children, root
  BREATH_FIRST: 'breadth-first'  //depth 1, depth 2, ..., depth n
});

export const TREE_MOVE_MODES = Enum({
  BEFORE: 'before',
  AFTER: 'after',
  CHILD: 'child'
});

export const TREE_DEFAULT_OPTIONS = {
  idKey: 'id',
  childrenKey: 'children',
  parentKey: 'parent',
  deepCopy: false,
  traversing: TREE_TRAVERSE_MODES.PRE_ORDER,
  moving: TREE_MOVE_MODES.AFTER
};

/**
 * Generic tree model factory
 * A tree is a node with N children
 * @param  {Array} _tree - Array of nodes [{id, children}, ...]
 * @param  {Object} _options - Options
 * @param  {Object} _options.idKey - Parameter name of the id key (default: 'id')
 * @param  {Object} _options.childrenKey - Parameter name of the children key (default: 'children')
 * @param  {Object} _options.parentKey - Parameter name of the parent key (default: 'parent')
 * @param  {Object} _options.traversing - Set default traversing mode (default: TREE_TRAVERSE_MODES.PRE_ORDER)
 * @param  {Object} _options.moving - Set default move mode (default: TREE_MOVE_MODES.AFTER)
 * @return {Array} - The augmented tree array
 */
export function Tree(_tree, _options) {
  if (!Array.isArray(_tree)) {
    throw new Error('Invalid tree parameter');
  }

  const options = Object.assign({}, TREE_DEFAULT_OPTIONS, _options);
  const tree = options.deepCopy ? JSON.parse(JSON.stringify(_tree)) : Array.from(_tree);

  for (let node of nodes()) {
    if (node[options.idKey] == null) throw new Error(`Missing node key "${options.idKey}"`);
  }

  /**
   * Returns an iterator to traverse the tree
   * @param  {String} _mode Traversing mode, default to `options.traversing`
   * @param  {Object} _opts Options
   * @param  {Boolean} _opts.meta Also yield additionnal informations (parent, depth, ...)
   * @return {Iterator}
   */
  function* nodes(_mode, _opts = {meta: false}) {
    if (!tree || !tree.length) return;

    const mode = _mode || options.traversing;
    if (!TREE_TRAVERSE_MODES.isValid(mode)) throw new Error('Invalid traversing mode');

    let node = null;
    let meta = null;

    //gives back a node and its metadata [node, meta]
    function mapMeta(_node, i) {
      const ancestors = meta.ancestors.slice();
      ancestors.push(node[options.idKey]);
      return [_node, {
        id: _node[options.idKey],
        parent: node,
        siblings: node[options.childrenKey].slice().filter((c, j) => j !== i),
        ancestors,
        depth: meta.depth + 1,
        index: i
      }];
    }

    //init quack (queue or stack) with root nodes and their metadata
    const quack = tree.map((node, i) => [node, {
      id: node[options.idKey],
      parent: null,
      siblings: tree.slice().filter((n, j) => j !== i),
      ancestors: [],
      depth: 1,
      index: i
    }]);

    let lastYieldedNode = null;

    while (quack.length) {
      //peek current node from quack
      [node, meta] = quack[0];
      if (_mode !== TREE_TRAVERSE_MODES.POST_ORDER) quack.shift();

      //insert children into quack
      if (hasChildren(node)) {
        const children = node[options.childrenKey];
        if (_mode === TREE_TRAVERSE_MODES.POST_ORDER) {
          //check if children were not allready inserted before
          if (children[children.length - 1] !== lastYieldedNode) {
            quack.unshift(...children.map(mapMeta));
            continue;
          }
        }
        else {
          const extractMethod = mode === TREE_TRAVERSE_MODES.PRE_ORDER ? 'unshift' : 'push';
          quack[extractMethod](...children.map(mapMeta));
        }
      }

      //yield current node
      yield _opts.meta ? [node, meta] : node;
      if (_mode === TREE_TRAVERSE_MODES.POST_ORDER) quack.shift();
      lastYieldedNode = node;
    }
  }

  /**
   * Returns a node object from its ID
   * @param  {String, Number} _id Node id
   * @return {Object}     Node
   */
  function getNode(_id) {
    if (typeof _id === 'object') return _id;
    for (let node of nodes()) {
      if (node[options.idKey] === _id) return node;
    }
  }

  /**
   * Returns a new array representing the tree data
   * @return {Array}
   */
  function getData() {
    return JSON.parse(JSON.stringify(tree));
  }

  /**
   * Returns informations about a node
   * @param  {String, Number, Object} _id Node id or object reference
   * @return {Object} {id, ancestors, parent, depth, index, siblings}
   */
  function getMeta(_idOrNode) {
    return typeof _idOrNode === 'object' ? _getMetaByRef(_idOrNode) : _getMetaById(_idOrNode);
  }

  function _getMetaById(_id) {
    for (let [node, meta] of nodes(TREE_TRAVERSE_MODES.PRE_ORDER, {meta: true})) {
      if (node[options.idKey] === _id) return meta;
    }
  }

  function _getMetaByRef(_node) {
    for (let [node, meta] of nodes(TREE_TRAVERSE_MODES.PRE_ORDER, {meta: true})) {
      if (node === _node) return meta;
    }
  }

  /**
   * Returns the depth of a node
   * @param  {String, Number, Object} _id Node id or object reference
   * @return {Number} Depth value
   */
  function getDepth(_idOrNode) {
    const meta = getMeta(_idOrNode);
    return meta && meta.depth;
  }

  /**
   * Returns the parent of a node (or null if no parent)
   * @param  {[String, Object]} _id Node id or object reference
   * @return {Object} Parent node
   */
  function getParent(_idOrNode) {
    const meta = getMeta(_idOrNode);
    return meta && meta.parent;
  }

  /**
   * Returns an array of ancestors of a given node
   * @param  {[String, Object]} _id Node id or object reference
   * @return {Array} Array of node ids
   */
  function getAncestors(_idOrNode) {
    const meta = getMeta(_idOrNode);
    return meta && meta.ancestors;
  }

  /**
   * Append a node to the given parent node
   * @param  {Object} _node     Node object to append
   * @param  {String} _parentId Parent node id (optional)
   * @return {Tree}
   */
  function appendNode(_node, _parentId) {
    if (!(_node || options.idKey in _node)) throw new Error('Invalid node');
    const branch = _getParentBranch(_parentId);
    if (!branch) return;
    branch.push(_node);
    return tree;
  }

  /**
   * Prepend a node to the given parent node
   * @param  {Object, String, Number} _node Node object reference or primitive id
   * @param  {String} _parentId Parent node id (optional)
   * @return {Tree}
   */
  function prependNode(_node, _parentId) {
    if (!(_node || options.idKey in _node)) throw new Error('Invalid node');
    const branch = _getParentBranch(_parentId);
    if (!branch) return;
    branch.unshift(_node);
    return tree;
  }

  /**
   * Removes a node and its children
   * @param  {Object, String, Number} _node Node object reference or primitive id
   * @return {Tree}
   */
  function removeNode(_node) {
    const meta = getMeta(_node);
    if (!meta) return tree;
    const children = meta.parent ? meta.parent.children : tree;
    children.splice(meta.index, 1);
    return tree;
  }

  /**
   * Return true if the given node has children
   * @param  {[Object, String, Number]}  _node A node object or node ID
   * @return {Boolean}
   */
  function hasChildren(_node) {
    let node = _node;
    if (typeof _node !== 'object') {
      node = getNode(_node);
    }
    return !!node
      && !!node[options.childrenKey]
      && Array.isArray(node[options.childrenKey])
      && !!node[options.childrenKey].length;
  }

  /**
   * Tell if a node has at least one sibling.
   * Root elements are considered to have the possibility to have siblings
   * @param  {Object, String, Number} _node Node or node id
   * @return {Boolean}
   */
  function hasSibling(_node) {
    return !!getMeta(_node).siblings.length;
  }

  /**
   * Tell if a node has at least one younger (left) sibling.
   * Root elements are considered to have the possibility to have siblings
   * @param  {Object, String, Number} _node Node or node id
   * @return {Boolean}
   */
  function hasYoungerSibling(_node) {
    const meta = getMeta(_node);
    return meta.siblings.length > meta.index;
  }

  /**
   * Tell if a node has at least one older (right) sibling.
   * Root elements are considered to have the possibility to have siblings
   * @param  {Object, String, Number} _node Node or node id
   * @return {Boolean}
   */
  function hasOlderSibling(_node) {
    return getMeta(_node).index > 0;
  }

  /**
   * Move a node and its children
   * @param  {*} _source - Source node id or object reference
   * @param  {*} _target - Target node id or object reference
   * @param  {String} [_mode=TREE_MOVE_MODES.AFTER] - How to insert the source relative to its target
   * @return {Tree}
   */
  function moveNode(_source, _target, _mode = TREE_MOVE_MODES.AFTER) {
    if (!TREE_MOVE_MODES.isValid(_mode)) throw new Error('Invalid move mode');

    const sourceNode = getNode(_source);
    let targetMeta = getMeta(_target);

    //prevent ancestor -> descendent drop and self drop
    if (targetMeta.ancestors.includes(sourceNode[options.idKey])) return;

    removeNode(sourceNode);

    targetMeta = getMeta(_target);
    const targetParent = targetMeta.parent;

    if (!sourceNode || !targetMeta) return tree;

    if (_mode === TREE_MOVE_MODES.CHILD) {
      appendNode(sourceNode, targetMeta.id);
    }
    else {
      const offset = _mode === TREE_MOVE_MODES.AFTER ? 1 : 0;
      const children = targetParent ? targetParent.children : tree;
      children.splice(targetMeta.index + offset, 0, sourceNode);
    }

    return tree;
  }

  /**
   * Returns a copy of the tree as a flat array representation
   * eg [{id, parent}]
   * @return {[type]} [description]
   */
  function toParentStructure() {
    let result = [];
    for (let [node, meta] of nodes(TREE_TRAVERSE_MODES.BREATH_FIRST, {meta: true})) {
      let parentId = meta.parent ? meta.parent[options.idKey] : null;
      let r = Object.assign({parent: parentId}, node);
      if (r.children) delete r.children;
      result.push(r);
    }
    return result;
  }

  /**
   * Retreive the branch (children array) of a parent
   * @param  {String, Number} _parentId id of a parent, or null for root branch
   * @return {Array} Children array of the parent or the root tree
   */
  function _getParentBranch(_parentId) {
    //return root tree if no parent given
    if (!_parentId) return tree;

    const node = getNode(_parentId);
    if (!node) return null;

    //ensure nodes have a children property
    node[options.childrenKey] = node[options.childrenKey] || [];
    return node[options.childrenKey];
  }

  Object.defineProperties(tree, {
    nodes: {value: nodes},
    options: {value: options},
    getNode: {value: getNode},
    getData: {value: getData},
    getMeta: {value: getMeta},
    getDepth: {value: getDepth},
    getParent: {value: getParent},
    getAncestors: {value: getAncestors},
    hasChildren: {value: hasChildren},
    hasSibling: {value: hasSibling},
    hasYoungerSibling: {value: hasYoungerSibling},
    hasOlderSibling: {value: hasOlderSibling},
    prependNode: {value: prependNode},
    appendNode: {value: appendNode},
    removeNode: {value: removeNode},
    moveNode: {value: moveNode},
    toParentStructure: {value: toParentStructure}
  });

  return tree;
}

/**
 * Build a tree from an array of flat nodes
 * @static
 * @param  {Array} _nodes  Array of nodes with a `parent` attribute
 * @param  {Object} _options Tree options
 * @return {Tree}
 */
function fromParentStructure(_nodes, _options) {
  const tree = Tree(_nodes, _options);
  for (let i = tree.length; i--;) {
    if (tree[i][tree.options.parentKey]) {
      let node = tree.splice(i, 1)[0];
      const parent = node[tree.options.parentKey];
      delete node[tree.options.parentKey];
      tree.prependNode(node, parent);
    }
  }
  for (let rootNode of tree) {
    delete rootNode[tree.options.parentKey];
  }
  return tree;
}

Object.defineProperties(Tree, {
  fromParentStructure: {value: fromParentStructure}
});
