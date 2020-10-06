import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './components/common/Home'
import Navbar from './components/common/Navbar'
import Register from './components/common/Register'
import Login from './components/common/Login'
import QuestIndex from './components/Quests/QuestIndex'
import QuestShow from './components/Quests/QuestShow'
import QuestCreate from './components/Quests/QuestCreate'
import ProfileShow from './components/user/ProfileShow'
import ProfileIndex from './components/user/ProfileIndex'


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/quests/:id" component={QuestShow} />
        <Route path="/quests" component={QuestIndex} />
        <Route path='/create' component={QuestCreate} />
        <Route path="/users" component={ProfileIndex} />
        <Route path="/users/:id" component={ProfileShow} />  
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
      {/* Footer */}
    </BrowserRouter>
  )
}

export default App
