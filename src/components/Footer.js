import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';

class Footer extends Component {
  render(){
    return(
      <footer>
          <div className="row">
              <div className="col-full">

                  <div className="footer-logo">
                      <a className="footer-site-logo" href="#0"><img src="images/logo.png" alt="Homepage"/></a>
                  </div>

                  <ul className="footer-social">
                    <li>
                        <a href="https://www.facebook.com/stillmen.vallian"><i className="fa fa-facebook" aria-hidden="true"></i><span>Facebook</span></a>
                    </li>
                    <li>
                        <a href="https://twitter.com/stillmenvallian"><i className="fa fa-twitter" aria-hidden="true"></i><span>Twiiter</span></a>
                    </li>
                    <li>
                        <a href="http://instagram.com/stillmen_jr"><i className="fa fa-instagram" aria-hidden="true"></i><span>Instagram</span></a>
                    </li>
                    <li>
                        <a href="https://github.com/ayenz/"><i className="fa fa-github" aria-hidden="true"></i><span>GitHub</span></a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/stillmen-vallian/"><i className="fa fa-linkedin" aria-hidden="true"></i><span>Linkedin</span></a>
                    </li>
                  </ul>

              </div>
          </div>

          <div className="row footer-bottom">

              <div className="col-twelve">
                  <div className="copyright">
                      <span>© Copyright Stillmen Vallian 2018</span>
                      <span>Created with <i className="fa fa-coffee"/> using React.js</span>
                      <span>Design by <a href="https://www.styleshout.com/">styleshout</a></span>
                  </div>

                  <div className="go-top">
                  <a className="smoothscroll" title="Back to Top" href="#top"><i className="fa fa-arrow-up" aria-hidden="true"></i></a>
                  </div>
              </div>

          </div>

      </footer>
    )
  }
}

export default Footer;
