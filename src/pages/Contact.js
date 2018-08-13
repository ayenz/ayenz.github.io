import React, { Component } from 'react';

class Contact extends Component{
  render(){
    return(
      <section id="contact" className="s-contact target-section">

          <div className="overlay"></div>

          <div className="row narrow section-intro">
              <div className="col-full">
                  <h3>Contact</h3>
                  <h1>Say Hello.</h1>

              </div>
          </div>

          <div className="row contact__main">
              <div className="col-six tab-full">
                <h4 className="h06">Name</h4>
                <p>Stillmen Vallian
                </p>

                <h4 className="h06">Address</h4>
                <p>
                Jalan Bukit Jarian No.46A<br/>
                Bandung, Jawa Barat<br/>
              40141 Indonesia
                </p>
                <h4 className="h06">Phone</h4>
                <p>Phone / Whatsapp: (+62) 7788 90 7788
                </p>

                <h4 className="h06">Email</h4>
                <p>stillmen.v@gmail.com
                </p>
              </div>
          </div>

      </section>
    )
  }
}

export default Contact;
