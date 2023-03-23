


let matrix = []
let nodeCounter = 0
// let nodeList = []
let labels = []

$(document).ready(function () {
    $('#submit-file').click(function () { readFile() })
})


function readFile() {
    $('#files').parse({
        config: {
            delimiter: "auto",
            complete: function (results) {
                tree = new Tree()
                nodeCounter = 0
                labels = []
                matrix = []

                let data = results.data
                for (i = 0; i < data.length; i++) {
                    let finalRow = []
                    let row = data[i]
                    // console.log(row)
                    finalRow = row.join(";").split(";")
                    matrix.push(finalRow)
                }
                initProcessData(matrix, 0)
            },
        },
        before: function (file, inputElem) {
            // console.log("Parsing file...", file)
        },
        error: function (err, file) {
            // console.log("ERROR:", err, file)
        },
        complete: function () {
            // console.log("Done with all files")
        }
    })
}

function initProcessData(matrix) {
    labels = matrix.shift()
    // console.log(matrix)
    processDataRecursive(matrix)
    $("#totalRegs").html(matrix.length + " instancias clasificadas.<br>Objetivo: " + labels[labels.length - 1])
    // console.log(nodeList)
    // console.log(tree.head)
    $('#ulTree').html(tree.toHTML(tree.head))//imprimir arbol
    tree.setPathways(tree.head)
    $("#rules").html(tree.getPathways())
    // console.log(tree.getPathways())
    $("#testRules").html(reviewRules(matrix))
}

function processDataRecursive(matrix, colToWork = 0, parent = '', direction = '') {
    matrix = bubbleSortMatrix(matrix, colToWork)
    // console.log(matrix)
    // console.log(colToWork)


    if (colToWork < matrix[0].length) {

        // buscar fila central
        let maxSize = Math.floor(matrix.length / 2) - 1
        let minSize = Math.floor(matrix.length / 2) - 1

        if (isUniform(matrix)) {
            colToWork++
            processDataRecursive(matrix, colToWork, parent, direction)
        } else {


            if (matrix.length > 1) {
                // console.log('')
                // console.log('col', labels[colToWork])

                // aumentar hasta encontrar un valor de cambio en la columna a trabajar
                while (typeof matrix[maxSize + 1] !== 'undefined' && matrix[maxSize][colToWork] == matrix[maxSize + 1][colToWork]) {
                    maxSize++
                }
                // console.log('maxSize', maxSize)

                // disminuir hasta encontrar un valor de cambio en la columna a trabajar
                while (typeof matrix[minSize - 1] !== 'undefined' && matrix[minSize][colToWork] == matrix[minSize - 1][colToWork]) {
                    minSize--
                }
                // console.log('minSize', minSize)

                if (maxSize < matrix.length - 1) {//si es mas cercano el cambio en una fila inferior
                    let m1 = matrix.slice(0, maxSize + 1)
                    let m2 = matrix.slice(maxSize + 1)
                    cutValue = ((((parseFloat(matrix[maxSize + 1][colToWork]) * 10000000) - (parseFloat(matrix[maxSize][colToWork]) * 10000000)) / 2) + parseFloat(matrix[maxSize][colToWork]) * 10000000) / 10000000
                    // console.log('cutValue if', cutValue)
                    let id = tree.addNode(parent, direction, cutValue, labels[colToWork], colToWork, matrix.length)
                    // colToWork++
                    if (colToWork == labels.length - 2) {
                        colToWork = 0
                    } else {
                        colToWork++
                    }
                    processDataRecursive(m1, colToWork, id, 'left')
                    processDataRecursive(m2, colToWork, id, 'right')
                } else if (minSize > 0) {//si es mas cercano el cambio en una fila superior
                    let m1 = matrix.slice(0, minSize + 1)
                    let m2 = matrix.slice(minSize + 1)
                    cutValue = ((((parseFloat(matrix[minSize][colToWork]) * 10000000) - (parseFloat(matrix[minSize - 1][colToWork]) * 10000000)) / 2) + parseFloat(matrix[minSize - 1][colToWork]) * 10000000) / 10000000
                    // console.log('cutValue else', cutValue)
                    let id = tree.addNode(parent, direction, cutValue, labels[colToWork], colToWork, matrix.length)
                    // colToWork++
                    if (colToWork == labels.length - 2) {
                        colToWork = 0
                    } else {
                        colToWork++
                    }
                    processDataRecursive(m1, colToWork, id, 'left')
                    processDataRecursive(m2, colToWork, id, 'right')
                } else {//si no hay cambios y todos son iguales
                    if (colToWork == labels.length - 2) {
                        colToWork = 0
                    } else {
                        colToWork++
                    }
                    processDataRecursive(matrix, colToWork, parent, direction)
                }
            } else {//si solo hay una fila
                if (colToWork == labels.length - 2) {
                    colToWork = 0
                } else {
                    colToWork++
                }
                processDataRecursive(matrix, colToWork, parent, direction)
            }
        }
    } else {
        tree.addNode(parent, direction, null, labels[labels.length - 1] + ' ' + matrix[0][matrix[0].length - 1], null, matrix.length)//añadir hoja
    }

}

function bubbleSortMatrix(matrix, field) {
    var i, j
    var len = matrix.length
    var isSwapped = false

    for (i = 0; i < len; i++) {

        isSwapped = false

        for (j = 0; j < len - 1; j++) {
            if (parseFloat(matrix[j][field]) > parseFloat(matrix[j + 1][field])) {
                var temp = matrix[j]
                matrix[j] = matrix[j + 1]
                matrix[j + 1] = temp
                isSwapped = true
            }
        }

        if (!isSwapped) {
            break
        }
    }

    return matrix
}

function isUniform(matrix) {
    let value = matrix[0][matrix[0].length - 1]
    for (i = 0; i < matrix.length; i++) {
        if (matrix[i][matrix[i].length - 1] !== value) {
            return false
        }
    }
    return true
}

function reviewRules(matrix) {
    // console.log(tree.head)
    // console.log('MATRIX', matrix)
    inRule = 0
    notInRule = 0
    matrix.forEach(function (item, index) {
        // console.log('')
        // console.log('------')
        // console.log('index',index)
        // console.log(item)

        head = tree.head
        if (compareRegisterToRules(head, item)) {
            inRule++
        } else {
            notInRule++
        }


    })
    // console.log('')
    // console.log('****************')
    // console.log('inRule',inRule)
    // console.log('notInRule',notInRule)
    // console.log('total',inRule + notInRule)
    // console.log('proporción de acierto en reescritura',inRule * 100 / (inRule + notInRule))

    return (inRule + notInRule) + ' registros comprobados: ' + inRule + ' acertados, ' + notInRule + ' fallados. <br>La proporción de acierto en reescritura es de ' + (Math.round(inRule * 100 / (inRule + notInRule) * 100) / 100) + '%'
}

function compareRegisterToRules(head, list) {
    if (head.cutValue == null) {//el nodo es hoja
        console.log('')
        console.log('node id',head.id)
        console.log('node',head.label)
        console.log('list',labels[labels.length - 1] + ' ' +list[list.length - 1])
        if (head.label == labels[labels.length - 1] + ' ' + list[list.length - 1]) {//si el valor en la ultima columna es igual al del nodo objetivo
            return true
        } else {
            return false
        }
    } else {//el nodo es padre

        if (list[head.col] > head.cutValue) {
            return compareRegisterToRules(head.right, list)
        } else {
            return compareRegisterToRules(head.left, list)
        }
    }
}






class Node {
    id
    label
    value
    cutValue
    col
    left
    right
    parent

    constructor(id, cutValue, label, col, value) {
        this.id = id
        this.cutValue = cutValue
        this.label = label
        this.col = col
        this.value = value
        this.left = null
        this.right = null
        this.parent = null
    }
}

class Tree {
    head
    nodeCounter
    paths

    constructor() {
        this.head = null
        this.nodeCounter = 0
        this.paths = []
    }

    findId(head, id) {
        if (head !== null) {
            var leftSearch = this.findId(head.left, id)
            var rightSearch = this.findId(head.right, id)

            if (parseInt(id) === head.id) {
                return head
            } else if (leftSearch !== false) {
                return leftSearch
            } else if (rightSearch !== false) {
                return rightSearch
            } else {
                return false
            }
        } else {
            return false
        }
    }

    addNode(parentId, direction, cutValue, label, col, value) {
        // console.log('')
        // console.log('---------')
        // console.log('parentId', parentId)
        // console.log('direction', direction)
        // console.log('cutValue', cutValue)
        // console.log('label', label)
        // console.log('value', value)
        // console.log('Tree', this.head)

        if (parentId === '') {
            // console.log('Parent empty')
            if (this.head == null) {
                // console.log('nodo raiz libre')
                this.nodeCounter++
                var newNode = new Node(this.nodeCounter, cutValue, label, col, value)
                this.head = newNode
                return this.nodeCounter
            } else {
                // console.log('nodo raiz ocupado')
                return false
            }

        } else {
            // parentId++
            var parentNode = this.findId(this.head, parentId)


            if (direction === "left") {
                if (parentNode.left === null) {
                    this.nodeCounter++
                    var newNode = new Node(this.nodeCounter, cutValue, label, col, value)
                    newNode.parent = parentNode
                    parentNode.left = newNode
                    return this.nodeCounter
                } else {
                    // console.log("El nodo ya esta ocupado,")
                    return false
                }

            } else if (direction === "right") {
                if (parentNode.right === null) {
                    this.nodeCounter++
                    var newNode = new Node(this.nodeCounter, cutValue, label, col, value)
                    newNode.parent = parentNode
                    parentNode.right = newNode
                    return this.nodeCounter
                } else {
                    // console.log("El nodo ya esta ocupado.")
                    return false
                }
            } else {
                // console.log('Direction ' + direction + ' no encontrada')
                return false
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
            })

            // console.log('')
            if (head.left !== null && head.right !== null) {
                // console.log('both')
                path1.push(head.label + ' < ' + head.cutValue)
                // console.log('path1', path1)
                this.setPathways(head.left, path1)
                path2.push(head.label + ' > ' + head.cutValue)
                // console.log('path2', path2)
                this.setPathways(head.right, path2)
            } else if (head.left !== null) {
                // console.log('left')
                pathway.push(head.label + ' < ' + head.cutValue)
                // console.log('pathway', pathway)
                this.setPathways(head.left, pathway)
            } else if (head.right !== null) {
                // console.log('right')
                pathway.push(head.label + ' > ' + head.cutValue)
                // console.log('pathway', pathway)
                this.setPathways(head.right, pathway)
            } else {
                // console.log('leaf')
                pathway.push(head.label)
                // console.log('pathway', pathway)
                this.paths.push(pathway)
            }
        }
    }

    getPathways() {
        // console.log(this.paths)
        let html = this.paths.length + ' reglas generadas'
        html += '<table class="table table-sm table-bordered">'
        for (let i = 0; i < this.paths.length; i++) {
            html += '<tr>'
            for (let j = 0; j < this.paths[i].length; j++) {
                html += '<td>' + this.paths[i][j] + '</td>'
            }
            html += '</tr>'

        }
        html += '</table>'
        return html
    }

    toHTML(head, treeId) {
        var html = ""
        // console.log('head',head)

        if (head === null) {
            return '<li><span class="px-2 py-1">*</span></li>'
        } else {
            var htmlLeft = this.toHTML(head.left, treeId)
            var htmlRight = this.toHTML(head.right, treeId)

            html = '<li>' +
                '<div class="rounded-pill px-2 py-1" title="' +
                head.value + '">' +
                head.label.toUpperCase() +
                (head.cutValue != null ? ' > ' + head.cutValue : '') +
                '</div>'

            if (!(head.left === null && head.right === null)) {

                html += '<ul>' +
                    htmlLeft +
                    htmlRight +
                    '</ul>' +
                    '</li>'
            }

            html += '</li>'
        }

        return html
    }
}

let tree = new Tree()
