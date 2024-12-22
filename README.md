# Library Management System

A Node.js-powered Library Management System for handling book reservations, borrowing, returning, and generating admin reports and logs.

---

## Features

### User Operations
- **Borrow Books**: Users can borrow books if available.
- **Return Books**: Users can return borrowed books.
- **View Borrowed Books**: Check the list of books currently borrowed by a user.

### Reservation System
- **Reserve Books**: Users can reserve books if unavailable.
- **Cancel Reservations**: Users can cancel their reservations.
- **View Reservations**: View active reservations per user.

### Admin Operations
- **Reports**:
  - Currently borrowed books
  - Overdue books with details of overdue period
- **Logs**:
  - System activity logs for tracking user and admin actions
  - Logs include actions like borrowing, returning, and reservation management

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/library-management-system.git
   cd library-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MongoDB**
   - Ensure MongoDB is running locally or update the connection string in the code:
     ```javascript
     mongoose.connect('mongodb://localhost/library');
     ```

4. **Run the server**
   ```bash
   npm start:dev
   ```

   The server will run at [http://localhost:4000](http://localhost:4000).

---

## API Endpoints

### **User Borrowing Management**
- **Borrow a Book**: `POST /borrow/:bookId`
- **Return a Book**: `POST /return/:bookId`
- **List Borrowed Books**: `GET /users/:id/borrowed-books`

### **Reservation System**
- **Reserve a Book**: `POST /reservations`
- **Cancel Reservation**: `DELETE /reservations/:reservationId`
- **List Reservations**:
  - All reservations: `GET /reservations`
  - User-specific: `GET /users/:id/reservations`

### **Admin Reports**
- **Currently Borrowed Books**: `GET /reports/borrowed-books`
- **Overdue Books**: `GET /reports/overdue-books`

### **Activity Logs**
- **View Logs**: `GET /logs`
- **Create Log Entry**: `POST /logs`

---

## Data Models

### **User**
```javascript
{
  name: String,
  borrowedBooks: [ObjectId],
  reservations: [ObjectId]
}
```

### **Book**
```javascript
{
  title: String,
  author: String,
  isAvailable: Boolean,
  borrowHistory: [
    {
      user: ObjectId,
      borrowedAt: Date,
      returnedAt: Date
    }
  ]
}
```

### **Log**
```javascript
{
  action: String,
  details: String,
  performedAt: Date
}
```
