import React,{Component} from "react";
import Node from './Node/Node'
import './Pathfinding.css'
import {bfs} from './Algorithms/BFS'
import {dfs} from './Algorithms/DFS'
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
            algorithm:'',
            visualizeButton : 'Visualize',
            visualizing : false,
            speed: 5,
            boardClear : true,
        };
        this.myRef = React.createRef();
    }
    componentDidMount() {
        const grid = makeFirstGrid()
        this.setState({grid})
    }
    handleMouseDown(row, col) {

        if (this.state.visualizing) return
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});

    }

    handleMouseEnter(row, col) {

        if (!this.state.mouseIsPressed || this.state.visualizing) return;
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
        var shortestPathNodes = this.shortestPath(startNode,finishNode)
        this.animateVisitedPath(visitedNodesInOrder,shortestPathNodes)

    }
    visualizeDFS() {
        const {grid} = this.state
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dfs(grid, startNode, finishNode);
        var shortestPathNodes = this.shortestPath(startNode,finishNode)
        this.animateVisitedPath(visitedNodesInOrder,shortestPathNodes)

    }
    visualizeShortestPath(shortestPathNodes) {
        if(shortestPathNodes.length ===0) this.updateState()
        for (let i = 0; i < shortestPathNodes.length; i++) {
            setTimeout(() => {

                const node = shortestPathNodes[i];
                if (this.checkStartEnd(node.row,node.col)){

                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest';}
            }, this.state.speed * i)
            if(i===shortestPathNodes.length-1){
                this.updateState()

                this.setState(this.setState({visualizing: false}))
            }
        }
    }
    animateVisitedPath(visitedNodesInOrder, shortestPathNodes){

         for (let i = 0; i < visitedNodesInOrder.length; i++) {

             setTimeout(() => {
                 const node = visitedNodesInOrder[i];
                 if (this.checkStartEnd(node.row,node.col)
                 ) {
                     document.getElementById(`node-${node.row}-${node.col}`).className =
                         'node node-visited';

                 }


             }, this.state.speed * i);
             if (i === visitedNodesInOrder.length - 1) {
                 setTimeout(() => {
                     this.visualizeShortestPath(shortestPathNodes);
                 }, this.state.speed * i);
                 return;
             }

         }
    }
    clearBoard(grid){
        if (this.state.visualizing) return
        this.clearObject(grid,'wall')
        this.clearObject(grid,'visited')
        this.clearObject(grid,'shortest')
    }
    clearObject(grid,block){
        const newGrid = grid.slice()

        for (var row = 0; row < this.state.grid.length;row ++){
            for (var col = 0; col < this.state.grid[0].length;col ++){
                const node = newGrid[row][col];
                let type;
                if(node.type === 'start'){
                    type = 'start'
                }else if(node.type === 'end') {
                    type = 'end'
                }else if(node.type === block){
                    type = 'empty';
                } else {
                    type = node.type;
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
        this.setState({grid: newGrid});
    }
    shortestPath(startpoint ,endpoint) {
        var  shortestPath = []
        var temp = endpoint
        if (endpoint.previousNode === null) return shortestPath
        while(!(startpoint.row === temp.row && startpoint.col === temp.col) ){
            shortestPath.push(temp)
            temp = temp.previousNode;
        }
        shortestPath.push(startpoint)
        return shortestPath
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
    onChangeAlgorithm(e) {
        this.setState({algorithm: e.target.value}) ;
        this.setState({visualizeButton: 'Visualize ' + e.target.value})

    }
    onChangeSpeed(e) {
        this.setState({speed: parseInt(e.target.value)}) ;



    }
    visualize(){
        if (this.state.visualizing) return
        const algorithm = this.state.algorithm
        if (algorithm === 'BFS'){
            this.setState({visualizing: true});
            this.checkBlocks()
            this.setState({boardClear: false});
            this.visualizeBFS()
        }else if(algorithm === 'DFS'){
            this.checkBlocks()
            this.setState({visualizing: true})
            this.visualizeDFS()
        }else {
            this.setState({visualizeButton: 'Pick an algorithm'})
        }

    }
    checkBlocks(){
        if (!this.state.boardClear){
            this.clearObject(this.state.grid,'shortest')
            this.clearObject(this.state.grid,'visited')
            this.setState({boardClear: true});
        }
        this.setState({boardClear: false});
    }
    render() {
      const {grid,mouseIsPressed} = this.state
        return (
            <>
                <select className="form-control"onChange={this.onChangeAlgorithm.bind(this)}>
                    <option value="">Pick an Algorithm</option>
                    <option value="BFS">Breadth First Search</option>
                    <option value="DFS">Depth First Search</option>
                </select>


                <button onClick={() => this.visualize()}>
                    {this.state.visualizeButton}
                </button>

                <button onClick={() => this.clearBoard(grid)}>
                    Clear Board
                </button>
                <select className="form-control"onChange={this.onChangeSpeed.bind(this)} defaultValue={"5"} >
                    <option value="2">Really Fast</option>
                    <option value="5" >Fast</option>
                    <option value="10">Medium</option>
                    <option value="20">Slow</option>
                </select>
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
    if(node.type === 'start'){
        type  ='start'
    }else if(node.type === 'end'){
        type  ='end'
    }
    else if (node.type === 'wall'){
        type  ='empty'
    }else {
        type = 'wall'
    }
    const newNode = {
        ...node,
        type :type

    };
    newGrid[row][col] = newNode;
    return newGrid;
};