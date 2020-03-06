import React from "react";

const RenderBookList = (props) => {
    try {
        return props.list.map(book => {
            return (
                <li key={book.id} className="list-item list-group-item d-flex align-items-center">
                    <strong className="title">{book.title}</strong>

                    <div className="author">{book.author}</div>
                    <div className="buttons">
                        <button type="button" className="btn btn-danger" onClick={event => props.removeBook(event, book.id)}>
                            Ta bort
                        </button>
                    </div>
                </li>
            )
        })
    } catch (err) {
        console.log(err)
    }

}

export default RenderBookList