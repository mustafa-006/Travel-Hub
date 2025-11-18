# Travel-Hub
social networking platform for tourism and travelling lovers
There is an authentication system and a time line for publishing posts and also publishing stories for 24 hours, as well as a group chat system during different rooms.

# Travel Hub Project

This is a simple Node.js project for user accounts and booking management using MySQL.

---

## Setup

1. **Install requirements**  
   - [Node.js](https://nodejs.org/)  
   - [MySQL](https://www.mysql.com/) (or XAMPP)

2. **Create databases**  

Open MySQL or phpMyAdmin and run:

```sql
CREATE DATABASE travel_hub_accounts;
USE travel_hub_accounts;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    country VARCHAR(100)
);
