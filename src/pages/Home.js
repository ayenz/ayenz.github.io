import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';

class Home extends Component{
  render(){
    if (this.props.data) {
      var name = this.props.data.name;
      var occupation = this.props.data.occupation;
      var city = this.props.data.address.city;
      var social = this.props.data.social.map(function(social, index){
        return  <li key={index}>
                  <a href={social.url}><i className={social.className} aria-hidden="true"></i><span>{social.name}</span></a>
                </li>
      })
    }
    return(
      <section id="home" className="s-home page-hero target-section" data-parallax="scroll" data-image-src="images/wallpaper.jpg" data-natural-width="3000" data-natural-height="2000" data-position-y="center">

           <div className="overlay"></div>
           <div className="shadow-overlay"></div>

           <div className="home-content">

               <div className="row home-content__main">

                   <h3>Hello There</h3>

                   <h1>
                       I'm {name}. <br/>
                       I'm a {occupation} <br/>
                     based in {city}.
                   </h1>

                   <div className="home-content__buttons">
                       <a href="#works" className="smoothscroll btn btn--stroke">
                           Latest Projects
                       </a>
                       <a href="#about" className="smoothscroll btn btn--stroke">
                           More About Me
                       </a>
                   </div>

                   <div className="home-content__scroll">
                       <a href="#about" className="scroll-link smoothscroll">
                           <span>Scroll Down</span>
                       </a>
                   </div>

               </div>

           </div>

           <ul className="home-social">
               {social}
           </ul>

       </section>
    )
  }
}

export default Home;
