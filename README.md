# **FullStack App**

- [**FullStack App**](#fullstack-app)
    - [***TL;DR***](#tldr)
  - [**Getting Started**](#getting-started)
    - [Tools](#tools)
  - [**Build/Run Locally**](#buildrun-locally)
    - [Run code locally](#run-code-locally)
    - [Run docker locally](#run-docker-locally)
  - [**NOTES**](#notes)
    - [**Built With**](#built-with)

### ***TL;DR***
  - What: FullStack Web App with Golang server, also MongoDB storage
  - How: REST api which serves a React frontend
  - Why: Allows for administrative tasks

---

## **Getting Started**

*All instructions are designed for use on Mac OS*

### Tools
```
 - Visual Studio Code
    - ESLint
    - SQL Server (mssql)
    - vscode-base64
 - Terminal
    - Brew
      ~$ brew install glide
      ~$ glide init
      ~$ glide update
      ~$ brew install node
      ~$ npm install
    - Golang
 - Chrome Browser (also Firefox, Safari, Edge (Not IE)
    - React Developer Tools
 - Studio 3T (MongoDB)
 - Docker
```

---

## **Build/Run Locally**

### Run code locally
```
make dep
npm start
```
Go to `localhost:8081` in a web browser

### Run docker locally
 - make build
 - docker run -p 8081:8081

Go to `http://localhost:8081/` in a web browser

---

## **NOTES**
  - Add Navigation Tab (Left-side)
    + js/components/PaperBase/Content.jsx
      - Add: 'Route' with embedded 'New-Component'
        + NOTE: 'exact path' is 'route' path

### **Built With**

* [Gin](github.com/gin-gonic/gin) - Routing
* [MGO](https://github.com/globalsign/mgo) - MongoDB driver for GO
* [MSSQLDB]("github.com/denisenkom/go-mssqldb") - MSSQL Driver for GO
* [JWT]("github.com/dgrijalva/jwt-go") - JWT.io for more info

---
