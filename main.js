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
    const sorted = mergeSort(arr, 0, arr.length - 1);
    const noDuplicate = removeDuplicate(sorted);
    
    console.log(sorted);
    console.log(noDuplicate);
}



/*[1, 7, 4, 23, 8]

(arr, 0,2)              (arr, 3,4)
[1,7,4]                [23,8]

[1,7]    [4]             [23]                [8]
(arr,0,1) (arr,2,2)      (arr, 3, 3)     (arr, 4,4)

[1]          [7]             [4]            [8,23]
(arr,0,0)   (arr,1,1)

[1,7] [4]          [8,23]

[1,4,7] [8,23]

[1,4,7,8,23]
*/

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

const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

buildTree(arr);