import React,{Component} from "react";
import Node from './Node/Node'
import './Pathfinding.css'
import {bfs,shortestPath} from './Algorithms/BFS'
const START_NODE_ROW = 7;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 7;
const FINISH_NODE_COL = 35;
export default class Pathfinding extends Component{
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
        this.myRef = React.createRef();
    }
    componentDidMount() {
        const grid = makeFirstGrid()
        this.setState({grid})
    }
    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});

    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }
    visualizeBFS() {
        const {grid} = this.state
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = bfs(grid, startNode, finishNode);
        var shortestPathNodes = shortestPath(startNode,finishNode)
        this.animateBFS(visitedNodesInOrder,shortestPathNodes)

    }
    visualizeShortestBFS(shortestPathNodes) {
        if(shortestPathNodes.length ===0) this.updateState()
        for (let i = 0; i < shortestPathNodes.length; i++) {
            setTimeout(() => {

                const node = shortestPathNodes[i];
                if (this.checkStartEnd(node.row,node.col)){

                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest';}
            }, 2 * i)
            if(i===shortestPathNodes.length-1){
                this.updateState()
            }
        }
    }
    animateBFS(visitedNodesInOrder,shortestPathNodes){

         for (let i = 0; i < visitedNodesInOrder.length; i++) {

             setTimeout(() => {
                 const node = visitedNodesInOrder[i];
                 if (this.checkStartEnd(node.row,node.col)
                 ) {
                     document.getElementById(`node-${node.row}-${node.col}`).className =
                         'node node-visited';

                 }


             }, 2 * i);
             if (i === visitedNodesInOrder.length - 1) {
                 setTimeout(() => {
                     this.visualizeShortestBFS(shortestPathNodes);
                 }, 2 * i);
                 return;
             }

         }
    }
    clearBoard(grid){
        this.updateState()
        const newGrid = grid.slice()

        for (var row = 0; row < this.state.grid.length;row ++){
            for (var col = 0; col < this.state.grid[0].length;col ++){
                const node = newGrid[row][col];
                let type;
                if(node.type === 'start'){
                    type = 'start'
                }else if(node.type === 'end') {
                    type = 'end'
                }else{
                    type = 'empty';
                }
                const newNode = {
                    ...node,
                    type :type,
                    isVisited:false,
                    previousNode:null

                };

                newGrid[row][col] = newNode;

            }
        }
        newGrid[START_NODE_ROW][START_NODE_COL].type= 'start'
        newGrid[FINISH_NODE_ROW][FINISH_NODE_COL].type= 'end'

        document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className= 'node node-start'
        document.getElementById(`node-${FINISH_NODE_ROW}-${ FINISH_NODE_COL}`).className= 'node node-finish'
        this.setState({grid: newGrid});

    }
    checkStartEnd(row,col){
        if ((row === START_NODE_ROW && col === START_NODE_COL) ){
            return false
        }if(( row === FINISH_NODE_ROW && col === FINISH_NODE_COL)){
            return false
        }return true
    }
    updateState(){
        let newGrid = this.state.grid
        for (var row = 0; row < this.state.grid.length;row ++){
            for (var col = 0; col < this.state.grid[0].length;col ++){
                const node = newGrid[row][col];
                if( document.getElementById(`node-${node.row}-${node.col}`).className=== 'node node-visited'){
                    const newNode = {
                        ...node,
                        type :'visited',
                    };
                    newGrid[row][col] = newNode;
                }else if( document.getElementById(`node-${node.row}-${node.col}`).className=== 'node node-shortest'){
                    const newNode = {
                        ...node,
                        type :'shortest',
                    };
                    newGrid[row][col] = newNode;
                }

            }
        }
        newGrid[START_NODE_ROW][ START_NODE_COL].type= 'start'
        newGrid[FINISH_NODE_ROW][ FINISH_NODE_COL].type= 'end'


        this.setState({grid: newGrid});

    }


    render() {
      const {grid,mouseIsPressed} = this.state
        return (
            <>
                <button onClick={() => this.visualizeBFS()}>
                    Visualize Breadth First Search
                </button>
                <button onClick={() => this.clearBoard(grid)}>
                    Clear Board
                </button>
                <div className="grid"  ref={this.myRef}>
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const {row, col, type} = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            type ={type}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) =>
                                                this.handleMouseEnter(row, col)
                                            }
                                            onMouseUp={() => this.handleMouseUp()}
                                            row={row}> </Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </>
        )
    }

}
function makeFirstGrid(){
    const grid =[]
    for (let row=0;row<15; row++){
        let rows =[];
        for (let col=0;col< 45; col++){
            rows.push(createCell(row,col))
        }grid.push(rows)
    }
    return grid;
}

function createCell(row,col) {
    let type;
    if (row === START_NODE_ROW && col === START_NODE_COL){
        type  ='start'
    }else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL){
        type = 'end'
    }else {
        type ='empty'
    }
    return {

        col,
        row,
        type,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    }
}
const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    let type;
    if (node.type === 'wall'){
        type  ='empty'
    }else if(node.type === 'empty'){
        type = 'wall'
    }else {
        type = node.type
    }
    const newNode = {
        ...node,
        type :type

    };
    newGrid[row][col] = newNode;
    return newGrid;
};