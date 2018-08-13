import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Photoswipe from './components/Photoswipe';


class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: {}
    }
  }

  componentDidMount(){
    fetch('resumeData.json')
    .then(d => d.json())
    .then(d => {
      this.setState({
        data: d
      })
    })
  }

  render(){
    return(
      <div className="App">
        <Header />
        <Home data= {this.state.data.main}/>
        <About data= {this.state.data.main} data2= {this.state.data.resume}/>
        <Works/>
        <Contact/>
        <Footer/>
        <Photoswipe />
      </div>
    )
  }
}


export default App;
