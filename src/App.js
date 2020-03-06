import React, { Component } from 'react'
import Header from './components/ui/Header/Header'
import RenderBookList from './RenderBookList';

const url = "https://www.forverkliga.se/JavaScript/api/crud.php?";

class App extends Component {
  constructor() {
    super()
    this.addBook = this.addBook.bind(this);
    this.removeBook = this.removeBook.bind(this);
    this.getNewKey = this.getNewKey.bind(this)
    this.getList = this.getList.bind(this)
    this.state = {
      list: [],
      title: "",
      author: "",
      counter: 10

    }
  }

  async getKey() {
    const cachedKey = localStorage.getItem("apiKey")

    if (cachedKey) {
      console.log(cachedKey)
      return cachedKey;
    } else {
      try {
        const apiKey = await fetch(url + "requestKey")
          .then(response => response.json())
          .then(result => result.key)


        localStorage.setItem('apiKey', apiKey)
        console.log(apiKey)


        return apiKey
      }
      catch (err) {
        return err;

      }
    }
  }

  async getList() {
  
    const key = "key=" + await this.getKey()
    await fetch(url + key + '&op=select')
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {

          this.setState({ list: result.data })
          console.log("List is set")
        } else if (result.status === "error") {
          console.log(result)
          this.getList();
          console.log("Trying to set list again")
          
        }

      })

  }

  componentDidMount(){
    this.getList();
  }

  async addBook(event) {
    event.persist();
    event.preventDefault();
    const authorInput = document.getElementById("author").value;
    const titleInput = document.getElementById("title").value;
    const key = "key=" + await this.getKey();

    for (var i = 10; i >= 0; i--) {
      await fetch(url + key + "&op=insert&title=" + titleInput + "&author=" + authorInput)
        .then(response => response.json())
        .then(response => {
          if (response.status === "error" && i > 0) {
            console.log(response)
            console.log(i + " tries left")
          } else {
            console.log("Added a book")
            i = 0;
            this.getList()
          }
        })
    }
  }

  async removeBook(event, id) {
    event.persist();
    const key = "key=" + await this.getKey();
    for (var i = 10; i >= 0; i--) {
      await fetch(url + key + "&op=delete&id=" + id)
        .then(response => response.json())
        .then(response => {
          if (response.status === "error" && i > 0) {
            console.log(response)
            console.log(i + " tries left")
          } else {
            console.log("Removed a book")
            i = 0;
            this.getList()
          }
        })
    }
  }

  async getNewKey(event) {
    event.persist();
    try {
      const apiKey = await fetch(url + "requestKey")
        .then(response => response.json())
        .then(result => result.key)
      localStorage.setItem('apiKey', apiKey)
      console.log(apiKey)
      return apiKey;
    }
    catch (err) {
      console.log(err)
      return err;

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
              <button
                id="btn"
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                onClick={this.getNewKey}
              >
                New Key
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
                <RenderBookList list={this.state.list} removeBook={this.removeBook}/>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
