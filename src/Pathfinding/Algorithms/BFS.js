module.exports = {


bfs :function (grid, startNode, finishNode){
    var dx=[0,-1,0,1]
    var dy =[1,0,-1,0]
    var visitedNodesinOrder = []
    var queue = [];
    queue.push(startNode)
    while (queue.length >0){
       var curNode =  queue.shift()
        if( curNode.type ==='end') return visitedNodesinOrder
        if( grid[curNode.row][curNode.col].type ==='wall') continue
        visitedNodesinOrder.push(curNode)

        for (var i = 0; i< 4 ;i++){
            if (isValid(curNode.row +dx[i],curNode.col+dy[i], grid)){
                let newNode = grid[curNode.row +dx[i]][curNode.col+dy[i]]
                newNode.previousNode = curNode
                newNode.isVisited = true;
                queue.push(newNode)

        }



}
}
return visitedNodesinOrder

}

}
function isValid(row,col,grid) {
    if(row < 0 || row >= grid.length|| col< 0|| col >= grid[0].length) return false
    if(grid[row][col].isVisited ) return false

    return true;
}