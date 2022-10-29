
ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9", "b55b025e438fa8a98e32482b5f768ff5"]; // window:load event for Javascript to run after HTML


let matrix = []
let nodeCounter = 0
let nodeList = []
let labels = []

$(document).ready(function () {
    $('#submit-file').click(function () { readFile() })
});


function readFile() {
    $('#files').parse({
        config: {
            delimiter: "auto",
            // complete: displayHTMLTable,
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
            // console.log("ERROR:", err, file);
        },
        complete: function () {
            // console.log("Done with all files");
        }
    });
}

function initProcessData(matrix) {
    labels = matrix.shift()
    console.log('labels', labels)
    processDataRecursive(matrix)
    console.log(nodeList)
    drawTree()
}

function processDataRecursive(matrix, colToWork = 0, parent = '') {

    console.log('')
    console.log('start', matrix)
    console.log('colToWork', colToWork)
    console.log('parent', parent)

    matrix = bubbleSortMatrix(matrix, colToWork)

    if (matrix.length > 1) {

        let maxSize = Math.floor(matrix.length / 2) - 1
        let minSize = Math.floor(matrix.length / 2) - 1

        while (typeof matrix[maxSize + 1] !== 'undefined' && matrix[maxSize][colToWork] == matrix[maxSize + 1][colToWork]) {
            maxSize++
        }

        while (typeof matrix[minSize - 1] !== 'undefined' && matrix[minSize][colToWork] == matrix[minSize - 1][colToWork]) {
            minSize--
        }

        // console.log('matrix.length', matrix.length)
        // console.log('maxSize', maxSize)
        // console.log('minSize', minSize)

        if (maxSize < matrix.length - 1) {
            console.log('cortando por arriba')
            let m1 = matrix.slice(0, maxSize + 1)
            let m2 = matrix.slice(maxSize + 1)
            cutValue = ((((matrix[maxSize + 1][colToWork] * 10000) - (matrix[maxSize][colToWork] * 10000)) / 2) + matrix[maxSize][colToWork] * 10000) / 10000
            id = createNode(parent, labels[colToWork] + ' ' + cutValue, matrix.length)
            console.log('id', id)
            // console.log('cutValue', cutValue)
            // console.log('cutValueI', matrix[maxSize][colToWork])
            // console.log('cutValueO', matrix[maxSize + 1][colToWork])
            console.log('m1', m1)
            console.log('m2', m2)
            colToWork++
            processDataRecursive(m1, colToWork, id)
            console.log('son1', id)
            processDataRecursive(m2, colToWork, id)
            console.log('son2', id)
        } else if (minSize > 0) {
            console.log('cortando por abajo')
            let m1 = matrix.slice(0, minSize + 1)
            let m2 = matrix.slice(minSize + 1)
            cutValue = ((((matrix[minSize + 1][colToWork] * 10000) - (matrix[minSize][colToWork] * 10000)) / 2) + matrix[minSize][colToWork] * 10000) / 10000
            id = createNode(parent, labels[colToWork] + ' ' + cutValue, matrix.length)
            console.log('id', id)
            // console.log('cutValue', cutValue)
            // console.log('cutValueI', matrix[minSize][colToWork])
            // console.log('cutValueO', matrix[minSize + 1][colToWork])
            console.log('m1', m1)
            console.log('m2', m2)
            colToWork++
            processDataRecursive(m1, colToWork, id)
            console.log('son1', id)
            processDataRecursive(m2, colToWork, id)
            console.log('son2', id)
        } else {
            console.log('matriz indivisible')
            id = createNode(parent, 'HOJA ' + labels[colToWork], matrix.length)
            console.log('id', id)
        }
    }

}

function bubbleSortMatrix(matrix, field) {

    var i, j;
    var len = matrix.length;

    var isSwapped = false;
    // console.log(matrix)

    for (i = 0; i < len; i++) {

        isSwapped = false;

        for (j = 0; j < len - 1; j++) {
            // console.log(matrix[j + 1][0])
            if (parseFloat(matrix[j][field]) > parseFloat(matrix[j + 1][field])) {
                var temp = matrix[j]
                matrix[j] = matrix[j + 1];
                matrix[j + 1] = temp;
                isSwapped = true;
            }
        }

        // IF no two elements were swapped by inner loop, then break

        if (!isSwapped) {
            break;
        }
    }

    // Print the matrixay
    // console.log(matrix)
    return matrix
}

function createNode(parent, name, value) {
    nodeList.push({
        id: nodeCounter,
        parent: parent,
        name: name,
        value: value
    })

    nodeCounter++
    return nodeCounter - 1
}

function drawTree() {
    let chartData = nodeList;

    let chartConfig = {
        type: 'tree',
        options: {
            link: {
                aspect: 'arc'
            },
            maxSize: 15,
            minSize: 5,
            node: {
                type: 'circle',
                tooltip: {
                    padding: '8px 10px',
                    borderRadius: '3px',
                }
            }
        },
        series: chartData
    };

    zingchart.render({
        id: 'tree',
        data: chartConfig,
        height: '100%',
        width: '100%',
        output: 'canvas'
    });

    // // change tree layout
    // document.getElementById('tree-aspect').addEventListener('change', function (e) {
    //     chartConfig.options.aspect = e.srcElement.value;
    //     zingchart.exec('tree', 'setdata', {
    //         data: chartConfig
    //     });
    // });

    // // change tree connector
    // document.getElementById('tree-node').addEventListener('change', function (e) {
    //     chartConfig.options.link.aspect = e.srcElement.value;
    //     zingchart.exec('tree', 'setdata', {
    //         data: chartConfig
    //     });
    // });

    // // change node type
    // document.getElementById('tree-node-shape').addEventListener('change', function (e) {
    //     chartConfig.options.node.type = e.srcElement.value;
    //     zingchart.exec('tree', 'setdata', {
    //         data: chartConfig
    //     });
    // })
}
