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
prettyPrint(tree.root);