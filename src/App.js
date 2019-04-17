import React, { Component } from 'react'
import Header from './components/ui/Header/Header'

const url = "https://www.forverkliga.se/JavaScript/api/crud.php?";

class App extends Component {
  constructor() {
    super()
this.addBook=this.addBook.bind(this);
this.removeBook=this.removeBook.bind(this);
this.addListItem=this.addListItem.bind(this);
this.getList();

    this.state = {
      list: [],
      title: "",
      author: "",
      counter:10

    }
  }


  getKey() {
    const cachedKey = localStorage.getItem("apiKey")

    if (cachedKey) {
      
      return cachedKey;
    } else {
      try {
        const apiKey = fetch(url + "requestKey")
          .then(response => response.json())
          .then(result => result.key)

        localStorage.setItem('apiKey', apiKey)
        return apiKey
      }
      catch (err) {
        return err;

      }
    }
  }

     getList() {
    const key = this.getKey()
      fetch(url + "key=" + key + '&op=select')
        .then(response => response.json())
        .then(result =>{
          if(result.status === "success"){
            
            this.setState({ list: result.data })
            console.log("List is set")

          }else if(result.status==="error"){
            this.getList();
            console.log("Trying to set list again")
          }else{
            
            console.log("this shouldnt happen")
          }
          
        })
 
  }




   addBook(event) {
     event.persist();
    event.preventDefault();
    const authorInput = document.getElementById("author").value;
    const titleInput = document.getElementById("title").value;
    const key = "key=" + this.getKey();
    
    fetch(url + key + "&op=insert&title=" + titleInput + "&author=" + authorInput)
    .then(response => response.json())
    .then(response => {
      if (response.status==="error"&& this.state.counter>0){
        console.log("An error occured while adding a book")
        this.setState({counter:this.state.counter - 1})
        console.log("Counter is " + this.state.counter)
        this.addBook(event);
      }else{

        console.log("Added a book")
        this.getList();
      }
    })

  }

   removeBook(event, id){
     event.persist();
    event.preventDefault();
    const key = this.getKey();
    

    fetch(url+"key="+key+"&op=delete&id="+id)
    .then(response => response.json())
    .then(response => {
      if (response.status==="error"&& this.state.counter>0){
        
        this.removeBook(event,id);
        this.setState({counter:this.state.counter - 1})
        console.log("Counter is " + this.state.counter )
      }else{

        console.log("Removed the book")
        this.setState({counter:10})
        this.getList();
      }
    })
    
  }

  addListItem() {
    try {
      return this.state.list.map(book => {
        return (
          <li key={book.id} className="list-item list-group-item d-flex align-items-center">
            <strong className="title">{book.title}</strong>

            <div className="author">{book.author}</div>
            <div className="buttons">
              <button type="button" className="btn btn-success">
                Editera
        </button>
              <button type="button" className="btn btn-danger" onClick={event=>this.removeBook(event,book.id)}>
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


  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <div className="row form-section">
            <form className="book-form col-6">
              <legend>Lägg till dina favoritböcker</legend>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  aria-describedby="title"
                  placeholder="Lägg till titel"
                />

                <input
                  type="text"
                  className="form-control"
                  id="author"
                  rows="3"
                  data-gramm="true"
                  data-txt_gramm_id="63b74fb6-c7e4-7f0e-0c1f-438d47ac87a0"
                  data-gramm_id="63b74fb6-c7e4-7f0e-0c1f-438d47ac87a0"
                  data-gramm_editor="true"
                  placeholder="Lägg till författare"
                />
              </div>
              <button
                id="btn"
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                onClick={this.addBook}
              >
                Skicka
              </button>
            </form>
          </div>
        </div>
        <div className="display-books">
          <div className="container">
            <div className="col-12">
              <ul className="list-group">
              <li key="Info" className="list-item list-group-item d-flex align-items-center">
            <strong className="title">Title</strong>

            <div className="author"><strong>Author</strong></div>
            <div className="buttons"><strong>Buttons </strong></div>
          </li>
              {this.addListItem()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
