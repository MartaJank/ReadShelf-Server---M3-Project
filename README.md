# ReadShelf - M3 Project

![logo]()

## Description

ReadShelf is an amazing platform to track your reads, organize the books you own and search for new books. :books: You can also add the books you can't find to your lists in order to have an accurate service.

Another cool feature is that you can join or even create book clubs to share the experience with other people. :family:

## User Stories

- **404** - As an anon/user I want to be politely warned that this page does not exist and it was my fault to search for it. :warning:

- **Homepage** - As anon/user I want to be able to access the homepage, see a brief description of its functionalities and access them from here. :house:

- **Search books** - As anon/user I want to be able to search for books and obtain the expected results. :mag_right:

- **Detailed display** -  As anon/user I want to be able to see a detailed display of a book to see more information about it and have access to add it to my lists if it interests me. :book: 

- **Sign Up** - As an anon I loved the page and want to see and use the additional features, such us adding books to lists, joining book clubs... Therefore I want to create an account. It's free! :free:

- **Log In** - As a user I want to log in so I can see the amazing aditional features and create or edit my profile! :smile:

- **Log Out** - As a user I want to close my session so no one else can access my profile. :wave:

- **Display and Edit Profile** - As a user, I want to be able to display and edit my profile to add a picture or change my data. :cowboy_hat_face:

- **Add books to lists** - As a user, I want to be able to add and organize my books in the different lists provided (such as *My Bookshelf* and *Reads Tracking*). :books:

- **Add a book** - As a user, if the book I search for doesn't exist, I want to be able to create it myself and add it to my shelves. :closed_book:

- **Leave a comment** - As a user, I want to be able to leave a comment under the detailed book display to leave my opinion or ask something about it. :spiral_notepad:

- **Move books between lists** - As a user, I want to move the books between my lists easily and as many times I want. :arrow_heading_down:

- **Delete a book from the list** - As a user, I want to delete books from my lists if I am no longer interested in them. :x:

- **Join a Book Club** - As a user, I would like to join a book club so I can share my reading experience with other people. :bookmark:

- **Create a Book Club** - As a user, I may like to create my own book club and let people join it. :family:

- **Edit and delete a Book Club** - As a user, if I've created a book club, I may want to edit. or delete it. :heavy_multiplication_x:

- **FAQ** - As a user, I may have some question about the platform so I would access the FAQ section to find out if they are already answered. :question:

  


## Backlog

- Rate books and calculate the average rating of the users of ReadShef

- Create an interactive form once the user signed up to learn about their book preferences and display personalized suggestions for them

- Create a chat between book club members

- Book exchange service between users

- Statistics section in tracking to show the books read a week, a month, a year...

- Add more detailed lists to the predefinded lists

- Blog section

  


# Client / Frontend

## React Router Routes (React App)
| Path                      | Component            | Permissions | Behavior                                                     |
| ------------------------- | -------------------- | ----------- | ------------------------------------------------------------ |
| `/`                       | Home        | public `<Route>`      | Home page                                        |
| `/signup`            | Signup         | anon only  `<AnonRoute>`   | Signup form, link to login, navigates to profile after signup |
| `/login`             | Login         | anon only `<AnonRoute>`  | Login form, link to signup, navigates to homepage after login |
| `/logout` | Navbar | anon only `<AnonRoute>` | Expire session, navigates to homepage after logout |
| `/books` | BooksList | public `<Route>` | Books listed, books SearchBar |
| `/books/:id` | BookDetails | public `<Route>` | Detailed view of a book, comments section, links all lists |
| `/books/:id` | Book Details | anon only `<AnonRoute>` | Adds book to a list of books, links to all the lists |
| `/books/:id` | BookDetails | anon only `<AnonRoute>` | Delete only a book the user has created, redirects to BooksList |
| `/books/add` | AddBook | anon only `<AnonRoute>` | Add Book form, navigates to detailed view of added book after submit, book added to Created Books |
| `/books/edit/:id` | EditBook | anon only `<AnonRoute>` | Edit Book form, navigates to detailed view of the book after submit |
| `/profile/:id` | Profile | anon only `<AnonRoute>` | Displays user profile, links to edit profile, bookshelf, reads tracking, user's book clubs and books created by user |
| `/profile/edit/:id` | EditProfile | anon only `<AnonRoute>` | Edit profile form, navigates to user profile on submit |
| `/lists/bookshelf` | Bookshelf | anon only `<AnonRoute>` | Displays added books, links to paper, ebook and audiobook |
| `/lists/reads-tracking` | ReadsTracking | anon only `<AnonRoute>` | Displays added books, links to pending, in progress and read |
| `/lists/move-book/:id` | MoveBookToList | anon only `<AnonRoute>` | Move books between lists, links to all the lists |
| `/lists/delete-book/:id` | DeleteBookFromList | anon only `<AnonRoute>` | Delete book from list only |
| `/book-clubs` | BookClubs | anon only `<AnonRoute>` | Displays all the book clubs, links to 'create club' and 'my bok clubs' |
| `/book-clubs/my` | MyBookClubs | anon only `<AnonRoute>` | Displays joined and created book clubs only |
| `/book-clubs/:id` | ClubDetails | anon only `<AnonRoute>` | Displays club details. If not joined linkes to join, if joined links to unjoin, if created links to edit and delete |
| `/book-clubs/add` | AddBookClub | anon only `<AnonRoute>` | Club add form, navigates to 'my book clubs' on submit |
| `/book-clubs/edit/:id` | EditBookClub | anon only `<AnonRoute>` | Edit club form, navigates to 'my book clubs' on submit |
| `/book-clubs/:id` | MyBookClubs / ClubDetails | anon only `<AnonRoute>` | Delete book club created by user,  navigates to 'my book clubs' on submit |
| `/faq` | FAQ | public `<Route>` | Displays FAQ |




## Components

- Login
- Signup
- Navbar
- Footer
- Searchbar
- Home
- BooksList
- BookDetails
- AddBook
- EditBook
- Profile
- EditProfile
- Bookshelf
- ReadsTracking
- MoveBookToList
- DeleteBookFromList
- BookClubs
- MyBookClubs
- ClubDetails
- AddBookClub
- EditBookClub
- FAQ
- 404Page




## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.imageUpload(file)
  - auth.logout()
  - auth.me()
- User Service
  - user.getAll()
  - user.getOne(id)
  - user.getOneByEmail(email)
  - user.updateUser(id, data)
- Books Service
- Lists Service
- Clubs Service




# Server / Backend


## Models

User model

```javascript
{
  img: {type: String},
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isAuthor: {type: Boolean, default: false},
  isBookCreator: {type: Boolean, default: false},
  isClubCreator: {type: Boolean, default: false},
  paperBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  eBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  audiobooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  pendingBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  inProgressBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  readBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}]
}
```



Book model

```javascript
 {
   title: {type: String, required: true},
   img: {type: String},
   author: {type: String},
   description: {type: String},
   genre: {type: String},
   year: {type: String},
   publishingHouse: {type: String},
   isbn: {type: String},
   rating: {type: Number},
   comment: [{
    title: {type: String},
    comments: {type: String}
  }]
 }
```



Club model

```javascript
{
  img: {type: String},
  title: {type: String, required: true},
  description: {type: String},
  bookToReadCover: {type: String},
  meetingDate: {type: String},
  meetingLink: {type: String}
}
```



Comment model

````javascript
{
	author: {type: Schema.Types.ObjectId, ref: 'User'},
  comment: String,
  bookReviewed: { type: Schema.Types.ObjectId, ref: 'Book' }
}
````




## API Endpoints (backend routes)

| HTTP Method | URL                         | Request Body                 | Success status | Error Status | Description                                                  |
| ----------- | --------------------------- | ---------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET         | `/auth/profile    `       | Saved session                | 200            | 404          | Check if user is logged in and return profile page           |
| POST        | `/auth/signup`                | {name, email, password}      | 201            | 404          | Checks if field's not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`                 | {username, password}         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`                | (empty)                      | 204            | 400       | Logs out the user                                            |
| GET         | `/books`                 |                                                              | 200            | 400          | Gets all books from API                                      |
| GET         | `/books/:id`             |                                                              | 200            | 400          | Gets a single book from API                                  |
| POST        | `/books/add`             | {title, author, description, genre, year, publishingHouse, isbn, img} | 200            | 404          | Adds a book to user's list                                   |
| PUT         | `/books/edit/:id`        | {title, author, description, genre, year, publishingHouse, isbn, img} | 201            | 400          | Edits a book created by user                                 |
| POST        | `/books/:id`             |                                                              | 200            | 400          | Adds a book to a user's list                                 |
| DELETE      | `/books/:id`             | (empty)                                                      | 200            | 400          | Deletes a book created by user                               |
| PUT         | `/profile/edit/:id`      | {name, email, img}                                           | 201            | 404          | Edits user profile                                           |
| GET         | `/lists/bookshelf`       |                                                              | 200            | 400          | Gets all the books the user saved in its bookshelf lists     |
| GET         | `/lists/reads-tracking`  |                                                              | 200            | 400          | Gets all the books the user saved in its tracking lists      |
| PUT         | `/lists/move-book/:id`   |                                                              | 200            | 400          | Moves a book from one list to another                        |
| DELETE      | `/lists/delete-book/:id` | (empty)                                                      | 200            | 400          | Deletes a book from the list                                 |
| GET         | `/book-clubs`            |                                                              | 200            | 400          | Gets all the book clubs created in the platform              |
| GET         | `/book-clubs/my`         |                                                              | 200            | 400          | Gets only the book clubs joined or created by the user       |
| GET         | `/book-clubs/:id`        |                                                              | 200            | 400          | Gets a single book club detailed info                        |
| POST        | `/book-clubs/add`        | {title. description, bookToReadCover, img}                   | 200            | 404          | Adds a new book club                                         |
| PUT         | `/book-clubs/edit/:id`   | {title, description, bookToReadCover, img, meetingDate, meetingLink} | 201            | 400          | Edits a single book club (only if created by user)           |
| DELETE      | `/book-clubs/:id`        | (empty)                                                      | 200            | 400          | Deletes a single book club (only if created by user)         |




## Links

#### Git

[Client repository Link](https://github.com/MartaJank/ReadShelf-Client---M3-Project)

[Server repository Link](https://github.com/MartaJank/ReadShelf-Server---M3-Project)

[Deployed App Link]()



#### Wireframes & Navigation Flow

[Wireframe](https://www.figma.com/file/PP1IfNgXCKjlkYnCOdxxSn/ReadShelf?node-id=0%3A1)

[Demo](https://www.figma.com/proto/PP1IfNgXCKjlkYnCOdxxSn/ReadShelf?node-id=2%3A5&scaling=scale-down)



#### Trello/Kanban

[Trello board](https://trello.com/b/uQvouwsJ/readshelf) 



#### Slides

[Slides Link]()


