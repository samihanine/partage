import React, { useEffect, useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import './index.scss';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import Espace from 'pages/Espace/Espace';
import Login from 'pages/Login/Login';
import Explorer from 'pages/Explorer/Explorer';
import Panel from 'pages/Panel/Panel';
import Compta from 'pages/Compta/Compta';

import { AiFillHome } from "react-icons/ai";
import { RiLoginCircleLine } from "react-icons/ri";

import { UserProvider, UserContext } from "context";

import login from 'utils/login';
import axios from 'axios';
import Forms from 'pages/Forms/Forms';
import FormsPanel from 'pages/Forms/FormsPanel';

function App() {
  const [user, setUser] = useContext(UserContext);
  const is_logged = user !== null;

  const tree = [
    { 
      title: "Mon Espace", 
      path:"/", exact:true, 
      component: user ?  Espace : Login, 
      display: 1, 
      unlock: true, 
      icon: user ?  AiFillHome : RiLoginCircleLine,
    },
    { 
      title: "Explorer", 
      path:"/explorer", 
      exact:true, 
      component: Explorer, 
      display: 1, 
      unlock: (is_logged && user.privilege == 2)
    },
    { 
      title: "Adminstration", 
      path:"/panel", 
      exact:true, 
      component: Panel, 
      display: 1, 
      unlock: (is_logged && user.privilege == 1)
    },
    { 
      title: "Comptabilité des clients", 
      path:"/compta", 
      exact:true, 
      component: Compta, 
      display: 1, 
      unlock: (is_logged && user.privilege == 4)
    },
    { 
      title: "Formulaires", 
      path:"/forms", 
      exact:true, 
      component: FormsPanel, 
      display: 1, 
      unlock: (is_logged)
    },
    { 
      title: "Formulaires", 
      path:"/forms/:id", 
      component: Forms, 
      display: 0, 
      unlock: true
    }
  ]

  const BuildTree = () => {
    return tree.map((item,index) => {
      //if (!item.unlock) return null;
      return <Route exact={item.exact} path={item.path} key={index}>
        <item.component />
      </Route>
    })
  }

  useEffect(() => {
      async function auth() {
        const mail = window.localStorage.getItem("mail");
        const password = window.localStorage.getItem("password");

        if (mail && password) {
          const result = await login(mail, password);
          setUser(result);
        }
      }

      const test = () => {
        axios({
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          url: process.env.REACT_APP_SERVER_URL + "/document" })
        .then((res) => console.log(""));
      }

      test();
      auth();
  }, []);



  return (
    <div className="app">
      <BrowserRouter>
        <Header user={user} tree={tree} />
        {(window.localStorage.getItem("mail") && !user) ? <div className="loading">
          <img src="https://asax.fr/wp-content/plugins/interactive-3d-flipbook-powered-physics-engine/assets/images/dark-loader.gif"/>
        </div> :
        <Switch>
          <BuildTree />
        </Switch>}
        <Footer />
      </BrowserRouter>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);