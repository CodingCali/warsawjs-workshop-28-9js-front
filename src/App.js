import React, { Component } from 'react';
import { BrowserRouter, Route,  Switch } from 'react-router-dom'
import Sidebar from './Sidebar'
import PostList from './PostList'
import PostFavList from './PostFavList'
import './App.css';
import {sendAllReguest} from './actions'

class App extends Component {

  newWorker

  state = {
    internetOnline: true,
    newServiceWorker: false
  }

  componentDidMount() {


    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('/sw.js').then((sw)=>{
    //     if(sw.waiting){
    //       this.newWorker = sw.waiting
    //       this.setState({
    //         ...this.state,
    //         newServiceWorker: true
    //
    //       })
    //     }
    //   });
    // }

    if(!navigator.onLine){
      this.setState({
        ...this.state,
        internetOnline: false
      })
      sendAllReguest()
    }

    window.addEventListener('offline', (e) => {
      this.setState({
        ...this.state,
        internetOnline: false
      })
    });

    window.addEventListener('online', (e) => {
      this.setState({
        ...this.state,
        internetOnline: true
      })
      sendAllReguest()
    });



    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.promptWindow = e;
    });

  }


  render() {
    return (
      <div className="App">
        <div id="warnings">
          {(!this.state.internetOnline)?(
              <div id={"internet_warning"}>
                You haven't got connection
              </div>
          ):("")}
          {(this.state.newServiceWorker)?(
              <div id={"update_warning"}>
                <button onClick={()=>{
                  this.newWorker.postMessage({ action: 'skipWaiting' })
                  window.location.reload()
                }
                }>
                  New service
                </button>
              </div>
          ):("")}
        </div>



        <BrowserRouter >
          <div>
            <Sidebar>

            </Sidebar>
            <Switch>
              <Route exact path="/" component={PostList}/>
              <Route exact path="/favourite" component={PostFavList}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
