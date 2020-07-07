import React from 'react'
import './Node.css';


export default class Node extends React.Component {

    render() {

        const {
            col,
            type,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            row,
        } = this.props;
        var extraClassName ='' ;
        if ( type === 'end'){
            extraClassName = 'node-finish'
        }else if (type === 'start'){
            extraClassName= 'node-start'
        }else if (type === 'empty') {
            extraClassName ='node-empty'
        }else if ( type === 'wall'){
            extraClassName= 'node-wall'
        }else if ( type === 'visited'){
            extraClassName= 'node-visited'
        }else if ( type === 'shortest'){
            extraClassName= 'node-shortest'
        }
        return (
            <div

                id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}> </div>
        );

    }
}