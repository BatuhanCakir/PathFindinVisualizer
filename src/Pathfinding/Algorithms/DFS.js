module.exports = {


    dfs :function (grid, startNode, finishNode){
        var dy=[-1,0,1,0]
        var dx =[0,1,0,-1]
        var visitedNodesinOrder = []
        var curNode = null
var stack = [];
        stack.push(startNode)
        while (stack.length >0){
            var temp = stack.pop()
            temp.previousNode = curNode
            temp.isVisited = true;
            curNode =  temp
            visitedNodesinOrder.push(curNode)
            if( curNode.type ==='end') return visitedNodesinOrder

            for (var i = 0; i< 4 ;i++){
                if (isValid(curNode.row +dx[i],curNode.col+dy[i], grid)){
                    let newNode = grid[curNode.row +dx[i]][curNode.col+dy[i]]

                    stack.push(newNode)

                }



            }


    }return visitedNodesinOrder

}}
function isValid(row,col,grid) {
    if(row < 0 || row >= grid.length|| col < 0|| col >= grid[0].length) return false
    if(grid[row][col].isVisited ) return false
    if(grid[row][col].type ==='wall') return false

    return true;
}