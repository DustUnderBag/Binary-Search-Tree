class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr = []) {
    if(arr.length === 0) {
      this.root = null;
      return;
    }

    const root = Tree.#buildTree(arr);
    this.root = root;
  }

  //New Tree instance builder functions
  static #buildTree(arr) {
    let sorted = mergeSort(arr, 0, arr.length - 1);

    //Remove duplicates in sorted array.
    sorted = removeDuplicate(sorted);
    
    console.log("Input sorted array", sorted);

    const treeRoot = Tree.#buildBST(sorted, 0, sorted.length - 1);
    return treeRoot;
  }

  //Expects sorted array
  static #buildBST(arr, start, end) {
    if(start > end) return null;

    const mid = Math.floor((start + end) / 2);

    let root = new Node(arr[mid]);
    root.left = Tree.#buildBST(arr, start, mid - 1);
    root.right = Tree.#buildBST(arr, mid + 1, end);

    return root;
  }

  insert(value) {
    let previousNode = null;
    let currentNode = this.root;

    while(currentNode !== null) {
      if(value === currentNode.data) {
        console.log("exists already");
        return;
      }

      previousNode = currentNode;

      if(value < currentNode.data)
        currentNode = currentNode.left;
      else
        currentNode = currentNode.right;
    }

    if(value < previousNode.data)
      previousNode.left = new Node(value);
    else
      previousNode.right = new Node(value);

  }
  
  //Level Order Traversal: Iterative solution
  levelOrderForEach(callback) {
    if(this.root === null) return;

    if( !(callback instanceof Function) )
      throw new Error("A callback is required!");

    const queue = [];
    queue.push(this.root);

    while(queue.length !== 0) {
      let firstNode = queue.shift();
      callback(firstNode.data);

      if(firstNode.left !== null) 
        queue.push(firstNode.left);

      if(firstNode.right !== null) 
        queue.push(firstNode.right);
    }
  }

  //Level Order Traversal: Recursive solution
  //Store nodes into an array level by level: Queue = [lv-0, lv-1, lv-2, lv-3, ...];
  /*
  Count level 0.
  1. Access a root, given level, given result [].
  2. Get the level number, insert current root into an array that is nested
     inside of the result array, the index equals to the level number.
  3. Check whether current node has left/right child, if yes, insert them 
     into the nested array nested inside result array at index (level + 1).
  */
  levelOrderForEachRecur(callback) {
    if(this.root === null) return; //Won't work with empty tree.
  
    try {
      if( !(callback instanceof Function) ) 
        throw new Error("A callback is required!");
    }catch(e) {
        console.log(e);
        return;
    }

    const result =  Tree.#buildLevelOrderRecur(this.root, 0, []);

    result.forEach(level => {
      level.forEach(node => callback(node.data));
    });
  }

  static #buildLevelOrderRecur(root, level, result) {
    if(root === null) return; //Exit if node is leaf node / null.

    //Insert new nested array if none represents current level.
    if(result.length - 1 < level)
      result[level] = [];

    result[level].push(root);
    
    Tree.#buildLevelOrderRecur(root.left, level + 1, result);
    Tree.#buildLevelOrderRecur(root.right, level + 1, result);

    return result;
  }

  height(value) {
    //1. Locate the node with given value.
    const targetNode = this.#findNode(value);

    //Return null if such node doesn't exist.
    if(targetNode === undefined) return undefined;
    
    //Run this method recursively to find height.
    return Tree.#getHeight(targetNode);
  }

  depth(value) {
    /*
    1. Initialize depth as 0
    2. currentNode = tree.root.
    3. if(value === curr.data) return height.
       if(value < curr.data) curr = left
       if(value > curr.data) curr = right
    4. height ++
    */

    let height = 0;
    let currNode = this.root;
    while(currNode !== null) {
      if(value === currNode.data) return height;

      if(value < currNode.data) 
        currNode = currNode.left;
      else
        currNode = currNode.right;
      
      height++;
    }

    //If currNode = null, such value is missing in the tree.
    return undefined;
  }

  static #getHeight(root) {
    /*Pseudocode
      Simplest case: 
       Assume a node's both children are leaf nodes, the leaf node's height is 0, 
       and the node's height is 0 + 1.
      Meaning parent's height = child's height + 1.

    Within single recursion
    0. If node is null, return -1, so that leaf node's height becomes 0.
    1. find height of left child, then add 1.
    2. find height of right child, then add 1.
    3. The higher one is height of parent node.
    */

    //Base case:
    if(root === null) return -1;

    const height_left = Tree.#getHeight(root.left) + 1;
    const height_right = Tree.#getHeight(root.right) + 1;

    if(height_left > height_right) return height_left;
    else return height_right;
  }

  #findNode(value) {
    /* Recursive
    if(root === null) return null;
    if(root.data === value) return root;

    if(value < root.data) {
      return findNode(root.left, value);
    } else if(value > root.data) {
      return findNode(root.right, value);
    }
    */
    
    let currNode = this.root;

    while(currNode !== null) {
      if(currNode.data === value) return currNode;

      if(value < currNode.data) currNode = currNode.left;
      else if(value > currNode.data) currNode = currNode.right;
    }

    //No such node exists.
    return undefined;
  }

  /*
  Conditions of a balanced tree:
  - Heights of left subtree & right subtree of root differs by at most 1.
  - Left subtree and right subtree are both balanced, therefore ensure all nodes' 
    heights are compared.

  Pseudocode:
  Make a helper function heightDiff(node): returns height difference of left & right
    1. At given node, use Tree.#getHeight(left/right), 
       to calculate its height on its left and right
    2. - tree root left height = Tree.#getHeight(root) + 1
      - tree root right right = Tree.#getHeigh(root) + 1.
      return difference = left - height
  
    In main method (recursively):
    1. At 8, calculate its diff.
    2. if 8 is balanced, calculate for 4, if 4 is balanced, repeat for 67.
    3. 
  */
  isBalanced() {
    if(this.root === null) return null;

    //Integrate level order queue, to calculate height of nodes level by level.
    //Order type doesn't matter, but this type has good time/space complexity.
    const queue = [];
    queue.push(this.root);

    while(queue.length !== 0) {
      //Keep reference to 1st node, then remove it from the queue.
      let firstNode = queue.shift();

      if(Tree.#heightDiff(firstNode) > 1) return false;

      if(firstNode.left !== null) queue.push(firstNode.left);

      if(firstNode.right !== null) queue.push(firstNode.right);
    }

    return true;
  }

  static #heightDiff(node) {
    const left = Tree.#getHeight(node.left);
    const right = Tree.#getHeight(node.right);
    return Math.abs(left - right);
  }

  //DLR
  preOrderForEach(callback) {
    if(this.root === null) return;

    //New Tree instance from current node's left
    let leftSubTree = new Tree();
    leftSubTree.root = this.root.left;

    //New Tree instance from current node's right
    let rightSubTree = new Tree();
    rightSubTree.root = this.root.right;

    callback(this.root.data);
    leftSubTree.preOrderForEach(callback);
    rightSubTree.preOrderForEach(callback);
  }

  //LDR
  inOrderForEach(callback) {
    if(this.root === null) return;

    //New Tree instance from current node's left
    let leftSubTree = new Tree();
    leftSubTree.root = this.root.left;

    //New Tree instance from current node's right
    let rightSubTree = new Tree();
    rightSubTree.root = this.root.right;

    
    leftSubTree.inOrderForEach(callback);
    callback(this.root.data);
    rightSubTree.inOrderForEach(callback);
  }

  //LRD
  postOrderForEach(callback) {
    if(this.root === null) return;

    //New Tree instance from current node's left
    let leftSubTree = new Tree();
    leftSubTree.root = this.root.left;

    //New Tree instance from current node's right
    let rightSubTree = new Tree();
    rightSubTree.root = this.root.right;

    
    leftSubTree.postOrderForEach(callback);
    rightSubTree.postOrderForEach(callback);
    callback(this.root.data);
  }

  rebalance() {
    if(this.isBalanced()) {
      console.log("Tree is already balanced, rebalance is unnecessary.");
      return;
    }

    const sortedArr = [];

    //Use in-order traversal to get sorted array,
    //thus no need to call mergeSort
    this.inOrderForEach( data => {
      sortedArr.push(data);
    });

    const newRoot = Tree.#buildBST(sortedArr, 0, sortedArr.length - 1);
    this.root = newRoot;
  }

}

//Delete functions

/*Three cases
1. Delete leaf node -> 
    Remove the leaf node directly.
    -> replace the node with null object.

2. Delete node with 1 child node -> 
     Connect target's parent node with the child node.
     -> Return the target's child node to the parent node.

3. Delete node with 2 child nodes ->
    Step 1: 
     Inorder successor: FInd the next greater value, which is the smallest value in right subtree OR 
     Inorder predecessor: Find the next smaller value, which is the largest value in left subtree.

    Step 2:
     Replace target node with that successor/predecessor node, then delete the replacement node.

    in deleteItem, find the target node, checks if it has two child nodes,
    - Make a variable `successor`, equals to `findSuccessor`
    - The Successor locate the next larger value, return the value.
    - Run `deleteItem`, feed the method with current node, and successor's value, this process deletes the successor/replacement node.
    - Assign the target node to be deleted with successor's value, 
    - Return root.

*/
function deleteItem(root, value) {
    //If value doesn't exist in the tree.
    if(root === null) return root;

    if(value < root.data) {
        root.left = deleteItem(root.left, value);
    }else if(value > root.data ) {
        root.right = deleteItem(root.right, value);
    }else {
        //If target node has no child, return null.
        if(root.left === null && root.right === null) return null;

        //If target node has ONE child, return its child.
        if(root.left === null) return root.right;
        if(root.right === null) return root.left;

        // If target node has TWO children, find next greater value(replacement node), 
        // replace target value with replacement value, 
        // delete the original replacement node. 
        const successorNode = findNextGreaterValue(root);
        root.right = deleteItem(root.right, successorNode.data);
        root.data = successorNode.data;
    }

    return root;
}

function findNextGreaterValue(currNode) {
    /*Find the next greater value.
      - Expects root.right as input.
        -Traverse till the left end of a given tree.
    /*
     Successor: a leaf node, meaning it's the smallest value in the right subtree.
     The smallest node has no left child, might or might not have right child.
    */
   currNode = currNode.right;

   while(currNode.left !== null) {
       currNode = currNode.left;
    }
    
    return currNode;
}


//Builder Functions
function mergeSort(arr, start, end) {
    if(start == end) return [arr[start]];
    
    //Split
    const mid = Math.floor((start + end) / 2);
    const left = mergeSort(arr, start, mid);
    const right = mergeSort(arr, mid+1, end);
    
    const merged =  merge(left, right);
    return merged;
    
}

function merge(a,b) {
    const c = [];

    let i = 0;
    let j = 0;
    let k = 0;

    while(i < a.length && j < b.length) {
        if(a[i] < b[j]) c[k++] = a[i++];
        else c[k++] = b[j++];
    }
    while(i < a.length) {
        c[k++] = a[i++];
    }

    while(j < b.length) {
        c[k++] = b[j++];
    }

    return c;
}

function removeDuplicate(arr) {
    const seen = {};

    return arr.filter( num => seen.hasOwnProperty(num) ? false : (seen[num] = true) );
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

const tree = new Tree(arr);
console.log("Original tree:");
prettyPrint(tree.root);

tree.insert(8.8);
tree.insert(326);
tree.insert(327);
tree.insert(7.7);
tree.insert(7.9)

console.log("After insertion:")
prettyPrint(tree.root);


function logNodeData(data) {
  console.log(data);
}

//tree.levelOrderForEach(logNodeData);

console.log(tree.isBalanced());
//tree.levelOrderForEachRecur(logNodeData);
//tree.postOrderForEach(logNodeData);


console.log("Rebalanced");
tree.rebalance();

prettyPrint(tree.root);
//tree.postOrderForEach(logNodeData);

