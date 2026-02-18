class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(root) {
        this.root = root;
    }
}

function insert(root , value) {
    if(root == null) return new Node(value);
    
    if(value < root.data) {
        root.left = insert(root.left, value);
    }else {
        root.right = insert(root.right, value);
    }
    return root;
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
        console.log("successor val: ", successorNode.data);
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

function buildTree(arr) {
    let sorted = mergeSort(arr, 0, arr.length - 1);

    //Remove duplicates in sorted array.
    sorted = removeDuplicate(sorted);
    
    console.log("Input sorted array", sorted);

    const root = buildBST(sorted, 0, sorted.length - 1);
    return new Tree(root);
}

function buildBST(arr, start, end) {
    if(start > end) return null;

    const mid = Math.floor((start + end) / 2);

    let root = new Node(arr[mid]);
    root.left = buildBST(arr, start, mid - 1);
    root.right = buildBST(arr, mid + 1, end);

    return root;
    
}

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

const tree = buildTree(arr);
insert(tree.root, 20.2);
insert(tree.root, 8.8)
prettyPrint(tree.root);

deleteItem(tree.root, 67);


prettyPrint(tree.root);
