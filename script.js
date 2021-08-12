//grabbing elements
const form = document.querySelector('#book-form');

//Book class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class: Handles UI tasks
class UI {
  //function to load books from storage
  static displayBooks() {
    const StoredBooks = Store.getBook();
      
    const books = StoredBooks;
    
    books.forEach(book => UI.addBookToList(book));
  }
  
  //function to add book to UI
  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><p class='delete'>x</p></td>
    `;
    
    list.appendChild(row);
  }
  
  //function to delete a book
  static deleteBook(elem){
    if (elem.classList.contains('delete')) {
      elem.parentElement.parentElement.remove();
    }
  }
  
  //show alert
  static showAlert(message, color){
    document.querySelector('#alert').style.display = 'block';
    document.querySelector('#alert').innerHTML = message;
    document.querySelector('#alert').style.backgroundColor = color;
    
    setTimeout(() => {
      document.querySelector('#alert').style.display = 'none'
    }, 3000);
  }
  
  //function to clear form fields
  static clearFields(){
  document.querySelector('#title').value = '';
  document.querySelector('#author').value= '';
  document.querySelector('#isbn').value = '';
  }
}

//Store class: Handles storage
class Store {
  static getBook() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    }else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    
    return books;
  }
  
  static addBook(book) {
    const books = Store.getBook();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  
  static removeBook(isbn) {
    const books = Store.getBook();
    
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

//Event: Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add Book
form.addEventListener('submit', (e) => {
  e.preventDefault();
  //get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;
  
  //validate form
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('please fill all forms', '#FF4419');
  }else{
    //instantiate book
  const book = new Book(title, author, isbn);
  UI.addBookToList(book);
  UI.clearFields();
  UI.showAlert('Book Added', 'green');
  
  //add book to store
  Store.addBook(book);
  }
});

//Event: Remove Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  //remove book from ui
  UI.deleteBook(e.target);
  UI.showAlert('Book Removed', '#0BA5F7');
  
  //remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});