# 餐廳論壇管理系統

一個餐廳論壇網頁，使用了 [Node.js](https://nodejs.org/en),[Express](https://expressjs.com/),[MySQL](https://www.mysql.com/)

可以使用**Dummy Data** 來登入網站或是自己註冊一個帳號來登入。

| Email             | Password | Role                                       |
| ----------------- | -------- | ------------------------------------------ |
| user1@example.com | 12345678 | User (access to front-stage)               |
| root@example.com  | 12345678 | Admin (access to front-stage & back-stage) |

# Features

###### Users(@前台)

| Feature                       | Detail                                           | API ROUTE                        |
| ----------------------------- | ------------------------------------------------ | -------------------------------- |
| Register                      | sign up an account with email,password,name      | `POST` /register                 |
| Login                         | sign in to the website                           | `POST` /login                    |
| Logout                        | sign out the account                             | -                                |
| All Restaurant                | users could see all restaurants' info            | `GET` /restaurants               |
| Filter Restaurant by Category | users could filter the restaurants by category   | `GET` /restaurants?categoryId=id |
| Specific Restaurant           | users could see the specific restaurant          | `GET` /restaurants/:id           |
| write comments for restaurant | users could write the comments for restaurant    | `POST` /restaurants/:id          |
| Add to Favorite               | users could add a restaurant to favorite list    | `POST` /favorite/:restaurantId   |
| remove to Favorite            | users could remove a restaurant to favorite list | `DELETE` /favorite/:restaurantId |
| Add to Like                   | users could add a restaurant to like list        | `POST` /like/:restaurantId       |
| remove to Like                | users could remove a restaurant to like list     | `DELETE` /like/:restaurantId     |
| restaurant dashBoard          | users could see restaurant's some data           | `GET` /restaurants/:id/dashboard |
| Specific User                 | users could see own profile                      | `GET` /users/:id                 |
| Edit User                     | users could edit profile                         | `PUT` /users/:id                 |
| Follow a User                 | users could follow others                        | `POST` /following/:userId        |
| UnFollow a User               | users could Unfollow others                      | `DELETE` /following/:userId      |

###### Admins(@後台)

| Feature                      | Detail                                               | API ROUTE                       |
| ---------------------------- | ---------------------------------------------------- | ------------------------------- |
| (Admin) Read all Restaurants | admin could view full restaurants list at back-stage | `GET` /admin/restaurants        |
| (Admin) Read a Restaurant    | admin could view a restaurants list at back-stage    | `GET` /admin/restaurants/:id    |
| (Admin) Create a Restaurant  | admin could create a restaurants list at back-stage  | `POST` /admin/restaurants/      |
| (Admin) Edit a Restaurant    | admin could edit a restaurants list at back-stage    | `PUT` /admin/restaurants/:id    |
| (Admin) Delete a Restaurant  | admin could delete a restaurants list at back-stage  | `DELETE` /admin/restaurants/:id |
| (Admin) Read all User        | admin could view full users list at back-stage       | `GET` /admin/users/             |
| (Admin) edit User role       | admin could change user's role at back-stage         | `PATCH` /admin/users/ :id       |

## Skills & Tools

- [Node.js](https://nodejs.org/en) & [npm](https://www.npmjs.com/) - Javascript runtime enviroment.
- [Express.js](https://expressjs.com/) - web application framework.
- [Express-Handlebars](https://www.npmjs.com/package/express-handlebars) - template engine.
- [MySQL](https://www.mysql.com/) - database management system.
- [Sequelize](https://sequelize.org/) - a Node.js ORM tool for MySQL.
- [method-override](https://www.npmjs.com/package/method-override) - middware for override Http verbs.
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs) - middleware for hashing a password
- [express-session](https://www.npmjs.com/package/express-session) - middleware
- [passport-jwt](http://www.passportjs.org/) - authentication middleware for Node.js
- [connect-flash](https://www.npmjs.com/package/connect-flash) - middleware for flash
- [multer](https://www.npmjs.com/package/multer) - middleware for uploading files
