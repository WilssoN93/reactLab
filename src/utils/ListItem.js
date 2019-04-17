
import React, { Component } from "react"

var state = {

title: "title"
, author: "author"

}




class ListItem extends Component {

    render() {
        return (
            <li className="list-item list-group-item d-flex align-items-center">
                <strong className="title"></strong>

                <div className="author"></div>
                <div className="buttons">
                    <button type="button" className="btn btn-success">
                        Editera
                </button>
                    <button type="button" className="btn btn-danger">
                        Ta bort
                </button>
                </div>
            </li>
            
            
        )
    }
}
export default ListItem;
