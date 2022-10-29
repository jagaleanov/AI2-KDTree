


let matrix = []
let nodeCounter = 0
// let nodeList = []
let labels = []

$(document).ready(function () {
    $('#submit-file').click(function () { readFile() })
});


function readFile() {
    $('#files').parse({
        config: {
            delimiter: "auto",
            complete: function (results) {
                let data = results.data
                matrix = []
                for (i = 0; i < data.length; i++) {
                    let finalRow = [];
                    let row = data[i];
                    finalRow = row.join(";").split(";");
                    matrix.push(finalRow)
                }
                initProcessData(matrix, 0)
            },
        },
        before: function (file, inputElem) {
            // console.log("Parsing file...", file);
        },
        error: function (err, file) {
            console.log("ERROR:", err, file);
        },
        complete: function () {
            // console.log("Done with all files");
        }
    });
}

function initProcessData(matrix) {
    labels = matrix.shift()
    processDataRecursive(matrix)
    // console.log(nodeList)
    console.log(tree.head)
    // drawTree()
    tree.toHTML(tree.head)
    $('#ulTree').html(tree.toHTML(tree.head));//imprimir arbol
    tree.setPathways(tree.head)
    $("#rules").html(tree.getPathways())
    // console.log(tree.getPathways())
}

function processDataRecursive(matrix, colToWork = 0, parent = '', direction = '') {


    matrix = bubbleSortMatrix(matrix, colToWork)


    if (colToWork < matrix[0].length) {

        let maxSize = Math.floor(matrix.length / 2) - 1
        let minSize = Math.floor(matrix.length / 2) - 1

        if (matrix.length > 1) {

            while (typeof matrix[maxSize + 1] !== 'undefined' && matrix[maxSize][colToWork] == matrix[maxSize + 1][colToWork]) {
                maxSize++
            }

            while (typeof matrix[minSize - 1] !== 'undefined' && matrix[minSize][colToWork] == matrix[minSize - 1][colToWork]) {
                minSize--
            }

            if (maxSize < matrix.length - 1) {
                let m1 = matrix.slice(0, maxSize + 1)
                let m2 = matrix.slice(maxSize + 1)
                cutValue = ((((matrix[maxSize + 1][colToWork] * 100000) - (matrix[maxSize][colToWork] * 100000)) / 2) + matrix[maxSize][colToWork] * 100000) / 100000
                // let id = createNode(parent, labels[colToWork] + '\n>' + cutValue, matrix.length, parent == '' ? 'head' : direction)
                let id = tree.addNode(parent, direction, cutValue, labels[colToWork], matrix.length)
                colToWork++
                processDataRecursive(m1, colToWork, id, 'left')
                processDataRecursive(m2, colToWork, id, 'right')
            } else if (minSize > 0) {
                let m1 = matrix.slice(0, minSize + 1)
                let m2 = matrix.slice(minSize + 1)
                cutValue = ((((matrix[minSize + 1][colToWork] * 100000) - (matrix[minSize][colToWork] * 100000)) / 2) + matrix[minSize][colToWork] * 100000) / 100000
                // let id = createNode(parent, labels[colToWork] + '\n>' + cutValue, matrix.length, parent == '' ? 'head' : direction)
                let id = tree.addNode(parent, direction, cutValue, labels[colToWork], matrix.length)
                colToWork++
                processDataRecursive(m1, colToWork, id, 'left')
                processDataRecursive(m2, colToWork, id, 'right')
            } else {
                colToWork++
                processDataRecursive(matrix, colToWork, parent, direction)
            }
        } else {
            colToWork++
            processDataRecursive(matrix, colToWork, parent, direction)
        }
    } else {
        // let id = createNode(parent, labels[labels.length - 1] + ' ' + matrix[0][matrix[0].length - 1], matrix.length)
        tree.addNode(parent, direction, null, labels[labels.length - 1] + ' ' + matrix[0][matrix[0].length - 1], matrix.length)
    }

}

function bubbleSortMatrix(matrix, field) {

    var i, j;
    var len = matrix.length;

    var isSwapped = false;

    for (i = 0; i < len; i++) {

        isSwapped = false;

        for (j = 0; j < len - 1; j++) {
            if (parseFloat(matrix[j][field]) > parseFloat(matrix[j + 1][field])) {
                var temp = matrix[j]
                matrix[j] = matrix[j + 1];
                matrix[j + 1] = temp;
                isSwapped = true;
            }
        }

        if (!isSwapped) {
            break;
        }
    }

    return matrix
}



// function createNode(parent, name, value, type) {
//     let node = {
//         id: nodeCounter.toString(),
//         parent: parent.toString(),
//         name: name.toUpperCase(),
//         value: value,
//         type: type
//     }
//     nodeList.push(node)

//     nodeCounter++
//     return nodeCounter - 1
// }


// function drawTree() {
//     let chartData = nodeList;

//     let chartConfig = {
//         type: 'tree',
//         options: {
//             link: {
//                 aspect: 'arc'
//             },
//             maxSize: 15,
//             minSize: 5,
//             node: {
//                 type: 'circle',
//                 tooltip: {
//                     padding: '8px 10px',
//                     borderRadius: '3px',
//                 }
//             }
//         },
//         series: chartData
//     };

//     zingchart.render({
//         id: 'tree',
//         data: chartConfig,
//         height: '400%',
//         width: '100%',
//         output: 'canvas'
//     });

// }






class Node {
    id;
    label;
    value;
    cutValue;
    left;
    right;
    parent;

    constructor(id, cutValue, label, value) {
        this.id = id;
        this.label = label;
        this.value = value;
        this.cutValue = cutValue;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class Tree {
    head;
    nodeCounter;
    paths

    constructor() {
        this.head = null;
        this.nodeCounter = 0;
        this.paths = [];
    }

    findId(head, id) {
        if (head !== null) {
            var leftSearch = this.findId(head.left, id);
            var rightSearch = this.findId(head.right, id);

            if (parseInt(id) === head.id) {
                return head;
            } else if (leftSearch !== false) {
                return leftSearch;
            } else if (rightSearch !== false) {
                return rightSearch;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    addNode(parentId, direction, cutValue, label, value) {
        console.log('')
        console.log('---------')
        console.log('parentId', parentId)
        console.log('direction', direction)
        console.log('cutValue', cutValue)
        console.log('label', label)
        console.log('value', value)
        console.log('Tree', this.head)

        if (parentId === '') {
            console.log('Parent empty')
            if (this.head == null) {
                console.log('nodo raiz libre')
                this.nodeCounter++;
                var newNode = new Node(this.nodeCounter, cutValue, label, value);
                this.head = newNode;
                return this.nodeCounter;
            } else {
                console.log('nodo raiz ocupado')
                return false;
            }

        } else {
            // parentId++
            var parentNode = this.findId(this.head, parentId);


            if (direction === "left") {
                if (parentNode.left === null) {
                    this.nodeCounter++;
                    var newNode = new Node(this.nodeCounter, cutValue, label, value);
                    newNode.parent = parentNode;
                    parentNode.left = newNode;
                    return this.nodeCounter;
                } else {
                    console.log("El nodo ya esta ocupado,");
                    return false;
                }

            } else if (direction === "right") {
                if (parentNode.right === null) {
                    this.nodeCounter++;
                    var newNode = new Node(this.nodeCounter, cutValue, label, value);
                    newNode.parent = parentNode;
                    parentNode.right = newNode;
                    return this.nodeCounter;
                } else {
                    console.log("El nodo ya esta ocupado.");
                    return false;
                }
            } else {
                console.log('Direction ' + direction + ' no encontrada');
                return false;
            }
        }
    }

    setPathways(head, pathway = []) {
        if (head !== null) {
            let path1 = []
            let path2 = []

            pathway.forEach(p => {
                path1.push(p)
                path2.push(p)
            });

            // console.log('')
            if (head.left !== null && head.right !== null) {
                // console.log('both')
                path1.push(head.label + ' <= ' + head.cutValue)
                // console.log('path1', path1)
                this.setPathways(head.left, path1);
                path2.push(head.label + ' > ' + head.cutValue)
                // console.log('path2', path2)
                this.setPathways(head.right, path2);
            } else if (head.left !== null) {
                // console.log('left')
                pathway.push(head.label + ' <= ' + head.cutValue)
                // console.log('pathway', pathway)
                this.setPathways(head.left, pathway);
            } else if (head.right !== null) {
                // console.log('right')
                pathway.push(head.label + ' > ' + head.cutValue)
                // console.log('pathway', pathway)
                this.setPathways(head.right, pathway);
            } else {
                // console.log('leaf')
                pathway.push(head.label)
                // console.log('pathway', pathway)
                this.paths.push(pathway)
            }
        }
    }

    getPathways() {
        let html = '<table class="table table-sm table-bordered">';
        for (let i = 0; i < this.paths.length; i++) {
            html += '<tr>'
            for (let j = 0; j < this.paths[i].length; j++) {
                html += '<td>' + this.paths[i][j] + '</td>'
            }
            html += '</tr>'

        }
        html += '</table>';
        return html
    }

    toHTML(head, treeId) {
        var html = "";
        console.log('head',head)

        if (head === null) {
            return '<li><span class="px-2 py-1">*</span></li>';
        } else {
            var htmlLeft = this.toHTML(head.left, treeId);
            var htmlRight = this.toHTML(head.right, treeId);

            html = '<li>' +
                '<div class="rounded-pill px-2 py-1" title="' +
                head.value + '">' +
                head.label.toUpperCase() +
                (head.cutValue != null ? ' > '+head.cutValue : '') +
                '</div>';

            if (!(head.left === null && head.right === null)) {

                html += '<ul>' +
                    htmlLeft +
                    htmlRight +
                    '</ul>' +
                    '</li>';
            }

            html += '</li>';
        }

        return html;
    }
}


var tree = new Tree();