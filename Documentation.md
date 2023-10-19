# Library System

## SCHEMA
![Untitled](https://github.com/mohamed-tarek-fouad/library/assets/73959776/4f5dc55d-4afc-46d7-a118-b9a8cf4d6cb8)

## Description 
System Library built with Nest.js, Prisma, Postgres, Redis, Docker to manage library main functionalities like adding new books or registering new members and the process of borrowing books with some analytics
about the members behaviours


## Instructions
first make sure you install Docker 
open the terminal and run
```
docker-compose up 
```
## API Reference

#### root uri
```http
 http://localhost:3000/
```
#### Register Admin
```http
  POST /auth/register
```

| Body Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`       | `string` | **Required** **Unique** must be valid email m@gmail.com|
| `name`   | `string`  | **Required** |
| `password`       | `string` | **Required** must have lowecase,uppercase,nums,special chracters and more than 8 |

### Response 
| Body Parameter | Type     | 
| :-------- | :------- | 
| `email`       | `string` | 
| `name`   | `string`  | 
| `message`       | `string` | 
| `access_token`       | `string` | 
| `id`     | `string` | 

#### Login Admin

```http
  POST /auth/login
```

| Body Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`       | `string` | **Required** **Unique** must be valid email m@gmail.com|
| `password`       | `string` | **Required** must have lowecase,uppercase,nums,special chracters and more than 8 |

### Response 
| Body Parameter | Type     | 
| :-------- | :------- | 
| `email`       | `string` | 
| `name`   | `string`  | 
| `message`       | `string` | 
| `access_token`       | `string` | 
| `id`     | `string` | 

#### Add Book

```http
  POST /books/addBook
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

| Body Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title`       | `string` | **Required** |
| `author`       | `string` | **Required** |
| `shelfLocation`       | `string` | **Required** |
| `ISBN`       | `string` | **Required** 13+ chars |
| `availableQuantity`       | `int` | **Required** |

### Response 
| Body Parameter | Type     | 
| :-------- | :------- | 
| `message`       | `string` | 
| `book`   | `objects`  | 
| `book.ISBN`       | `string` | 
| `book.title`       | `string` | 
| `book.availableQuantity`     | `string` | 
| `book.author`       | `string` | 
| `book.shelfLocation`       | `string` | 

#### Update Book

```http
  PATCH books/updateBook/${ID}
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

| Param Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `bookID`  | `string` | **Required** |

| Body Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title`       | `string` | **Optional** |
| `author`       | `string` | **Optional** |
| `shelfLocation`       | `string` | **Optional** |
| `ISBN`       | `string` | **Optional** 13+ chars |
| `availableQuantity`       | `int` | **Optional** |


### Response 
| Body Parameter | Type     | 
| :-------- | :------- | 
| `message`       | `string` | 
| `book`   | `objects`  | 
| `book.ISBN`       | `string` | 
| `book.title`       | `string` | 
| `book.availableQuantity`     | `string` | 
| `book.author`       | `string` | 
| `book.shelfLocation`       | `string` | 

#### Delete Book
```http
  DELETE  books/deleteBook/${ID}
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}| 

| Param Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `bookID`  | `string` | **Required** |

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 
| `book`      | `object` | 
| `book.ISBN`      | `string` | 
| `book.title`      | `string` | 
| `book.author`      | `string` | 
| `book.availableQuantity`      | `int` | 
| `book.shelfLocation`      | `string` | 

#### All Books

```http
  GET /books/allBooks
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 
| `books`      | `array` | 
| `books[].ISBN`      | `string` | 
| `books[].title`      | `string` | 
| `books[].author`      | `string` | 
| `books[].availableQuantity`      | `int` | 
| `books[].shelfLocation`      | `string` | 

#### Search Book

```http
 Get /books/searchBook
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

| Query Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `author`     | `string` | **Optional** |
| `ISBN`        | `string` | **Optional** |
| `title`        | `string` | **Optional** |

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 
| `books`      | `array` | 
| `books[].ISBN`      | `string` | 
| `books[].title`      | `string` | 
| `books[].author`      | `string` | 
| `books[].availableQuantity`      | `int` | 
| `books[].shelfLocation`      | `string` | 


#### Register Borrower
```http
  POST /borrower/registerBorrower
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

| Body Parameter | Type     | Description                |
| :------------- | :------- | :------------------------- |
| `email`        | `string` | **Required** **Unique** must be valid email m@gmail.com|
| `name`     | `string` | **Required** |


### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `borrower`        | `object` | 
| `borrower.id`     | `string` | 
| `borrower.name`  | `string` | 
| `borrower.email`   | `string` | 
| `borrower.registerdDate`       | `string` | 
| `message`      | `string` | 


#### Update Borrower
```http
  PATCH /borrower/updateBorrower/{ID}
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

| Param Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `borrowerId`  | `string` | **Required** |

| Body Parameter | Type     | Description                |
| :------------- | :------- | :------------------------- |
| `email`        | `string` | **Optional** **Unique** must be valid email m@gmail.com|
| `name`     | `string` | **Optional** |


### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `borrower`        | `object` | 
| `borrower.id`     | `string` | 
| `borrower.name`  | `string` | 
| `borrower.email`   | `string` | 
| `borrower.registerdDate`       | `string` | 
| `message`      | `string` | 
#### Delete Borrower
```http
  DELETE /borrower/deleteBorrower/{ID}
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

| Param Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `borrowerId`  | `string` | **Required** |


### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `borrower`        | `object` | 
| `borrower.id`     | `string` | 
| `borrower.name`  | `string` | 
| `borrower.email`   | `string` | 
| `borrower.registerdDate`       | `string` | 
| `message`      | `string` | 


#### All Borrowers
```http
  GET /borrower/allBorrowers
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|



### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `borrowers`        | `array` | 
| `borrowers[].id`     | `string` | 
| `borrowers[].name`  | `string` | 
| `borrowers[].email`   | `string` | 
| `borrowers[].registerdDate`       | `string` | 
| `message`      | `string` | 


#### Check Out Book
```http
  POST /borrower/checkoutBook
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

| Body Parameter | Type     | Description                |
| :------------- | :------- | :------------------------- |
| `borrowerId`        | `string` | **Required** |
| `ISBN`     | `string` | **Required** |
| `dueDate`     | `string` | **Required** |

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `id`        | `object` | 
| `borroweBook`     | `object` | 
| `borroweBook.borrowerId`     | `string` | 
| `borroweBook.bookId`  | `string` | 
| `borroweBook.borroweDate`   | `string` | 
| `borroweBook.dueDate`       | `string` | 
| `message`      | `string` | 
| `borroweBook.returned`      | `bool` | 
| `borroweBook.returnedLate`      | `bool` | 
| `borroweBook.returnedDate`      | `string` | 

#### return Book
```http
  POST /borrower/returnBook
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

| Body Parameter | Type     | Description                |
| :------------- | :------- | :------------------------- |
| `borrowerId`        | `string` | **Required** |
| `ISBN`     | `string` | **Required** |

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 

#### Books Borrower Have
```http
 GET /borrower/booksBorrowerHave/${ID}
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

| Param Parameter |   Type   | Description                |
| :------------- | :------- | :------------------------- |
| `borrowerId`  | `string` | **Required** |

### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 
| `books`      | `array` | 
| `books[].id`      | `string` | 
| `books[].borrowerId`      | `string` | 
| `books[].bookId`      | `string` | 
| `books[].borrowDate`      | `string` | 
| `books[].dueDate`      | `string` | 
| `books[].returned`      | `bool` | 
| `books[].returnedLate`      | `bool` | 
| `books[].returnedDate`      | `string` |
| `books[].book`      | `object` | 
| `books[].book.ISBN`      | `string` | 
| `books[].book.title`      | `string` | 
| `books[].book.author`      | `string` | 
| `books[].book.availableQuantity`      | `int` | 
| `books[].book.shelfLocation`      | `string` | 
| `books[].borrower`      | `object` | 
| `books[].borrower.id`      | `string` | 
| `books[].borrower.name`      | `string` | 
| `books[].borrower.email`      | `string` | 
| `books[].borrower.registerdDate`      | `string` | 

#### Over Due Books
```http
  GET /borrower/overDueBooks
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|


### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` | 
| `books`      | `array` | 
| `books[].id`      | `string` | 
| `books[].borrowerId`      | `string` | 
| `books[].bookId`      | `string` | 
| `books[].borrowDate`      | `string` | 
| `books[].dueDate`      | `string` | 
| `books[].returned`      | `bool` | 
| `books[].returnedLate`      | `bool` | 
| `books[].returnedDate`      | `string` |
| `books[].book`      | `object` | 
| `books[].book.ISBN`      | `string` | 
| `books[].book.title`      | `string` | 
| `books[].book.author`      | `string` | 
| `books[].book.availableQuantity`      | `int` | 
| `books[].book.shelfLocation`      | `string` | 
| `books[].borrower`      | `object` | 
| `books[].borrower.id`      | `string` | 
| `books[].borrower.name`      | `string` | 
| `books[].borrower.email`      | `string` | 
| `books[].borrower.registerdDate`      | `string` | 

#### export Report
```http
  POST /borrower/exportReport
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|

| Body Parameter | Type     | Description                |
| :------------- | :------- | :------------------------- |
| `startDate`        | `string` | **Required** |
| `endDate`     | `string` | **Required** |

### Response 
| Header Parameter | Type     | 
| :------------- | :------- | 
| `file`      | `blob` |

#### All Over Due Borrows Of The Last Month
```http
  GET /borrower/allOverDueBorrowsOfTheLastMonth
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|


### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` |
| `borrows`      | `array` |
| `borrows[].id`      | `string` |
| `borrows[].borrowerId`      | `string` |
| `borrows[].bookId`      | `string` |
| `borrows[].borrowDate`      | `string` |
| `borrows[].dueDate`      | `string` |
| `borrows[].returned`      | `bool` |
| `borrows[].returnedLate`      | `bool` |
| `borrows[].returnedDate`      | `string` |


#### All Borrows Of The Last Month
```http
  GET /borrower/allBorrowsOfTheLastMonth
```
| Header Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authentication`       | `string` | **Required** Bearer ${accessToken}|


### Response 
| Body Parameter | Type     | 
| :------------- | :------- | 
| `message`      | `string` |
| `borrows`      | `array` |
| `borrows[].id`      | `string` |
| `borrows[].borrowerId`      | `string` |
| `borrows[].bookId`      | `string` |
| `borrows[].borrowDate`      | `string` |
| `borrows[].dueDate`      | `string` |
| `borrows[].returned`      | `bool` |
| `borrows[].returnedLate`      | `bool` |
| `borrows[].returnedDate`      | `string` |
