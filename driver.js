import { Tree, prettyPrint } from "./main.js";

const arr = makeRandomArr(15, 100);

const tree = new Tree(arr);
prettyPrint(tree.root);
console.log(tree.isBalanced());

console.log("Level Order: ");
tree.levelOrderForEach(logData);

console.log("Pre Order: ");
tree.preOrderForEach(logData);

console.log("In Order: ");
tree.inOrderForEach(logData);

console.log("Post Order: ");
tree.postOrderForEach(logData);


//Unbalance the tree, by inserting <100 values.
tree.insert(150);
tree.insert(123);
tree.insert(721);
tree.insert(256);

prettyPrint(tree.root);
console.log(tree.isBalanced());

//Rebalance tree;
tree.rebalance();
prettyPrint(tree.root);
console.log(tree.isBalanced());

console.log("Level Order: ");
tree.levelOrderForEach(logData);

console.log("Pre Order: ");
tree.preOrderForEach(logData);

console.log("In Order: ");
tree.inOrderForEach(logData);

console.log("Post Order: ");
tree.postOrderForEach(logData);


//Tester functions
function makeRandomArr(x, max) {
    const arr = [];
    for(let i = 0; i < x; i++) {
       arr.push(getMaxInt(max));
    }

    return arr;
}

function getMaxInt(max) {
    return Math.floor(Math.random() * max);
}

function logData(data) {
    console.log(data);
}