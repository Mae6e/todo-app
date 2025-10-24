## 📝 TodoApp (NestJS)

A modular **Todo List Application** built with **NestJS**, **MongoDB**, and **JWT authentication**.  
This project demonstrates a clean, scalable architecture with **modular design**, **custom response interfaces**, and **robust exception handling**.

---

### 🧰 Tech Stack

- **Backend:** NestJS (Node.js)  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Token)  

---

### ⚙️ Setup & Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/todoapp-nestjs.git
cd todoapp-nestjs
```

#### 2️⃣ Create and Configure `.env` File
Before running the app, create a `.env` file in the project root and configure it as needed.  
Example:
```env
MONGODB_CONNECTION=mongodb://localhost:27017/todoapp
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 3️⃣ Install Dependencies
```bash
pnpm i
```

### 4️⃣ Run the Application
```bash
pnpm start:dev
```

Your application will start in development mode on the specified port.

---

### 🚀 Features

- 👤 User **Signup** with email & password  
- 🔐 User **Signin** with JWT authentication  
- 🧱 **Protected routes** using JWT guards  
- 📦 **CRUD operations** for tasks (Create, Read, Update, Delete)  
- 🧩 **Modular structure** (Auth Module, Task Module)  

---