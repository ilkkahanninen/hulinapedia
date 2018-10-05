import React from 'react'
import { Router, Link } from 'react-static'
import { hot } from 'react-hot-loader'
//
import Routes from 'react-static-routes'

import './app.css'
import { PageMeta } from "./components/PageMeta";

const App = () => (
  <Router>
    <div>
      <PageMeta />
      <nav>
        <div className="responsive-container">
          <Link to="/">Hulinapedia</Link>
        </div>
      </nav>
      <div className="content responsive-container">
        <Routes />
      </div>
    </div>
  </Router>
)

export default hot(module)(App)
