import React, { Component } from 'react';

class About extends Component{
  render(){
    if (this.props.data) {
      var shortBio=this.props.data.shortBio;
      var bio=this.props.data.bio;
      var bio2=this.props.data.bio2;
      var bio3=this.props.data.bio3;
      var bio4=this.props.data.bio4;

      var skills=this.props.data.otherSkills.map(function(s, index){
        return <li key={index}>
                <div className={s.progress}><span>{s.percent}</span></div>
                <strong>{s.name}</strong>
               </li>
      });

      var otherSkills=this.props.data.otherSkills.map(function(s, index){
        return <li key={index}>
                <div className={s.progress}><span>{s.percent}</span></div>
                <strong>{s.name}</strong>
               </li>
      })
    }

    if (this.props.data2) {
      var education=this.props.data2.education.map(function(edu, index){
        return <div className="timeline__block" key={index}>
                  <div className="timeline__bullet"></div>
                  <div className="timeline__header">
                      <p className="timeline__timeframe">{edu.graduated}</p>
                      <h3>{edu.school}</h3>
                      <h5>{edu.degree}</h5>
                  </div>
                  <div className="timeline__desc">
                      <p>{edu.description}</p>
                  </div>
              </div>
      });

      var organization=this.props.data2.organization.map(function(org, index){
        return <div className="timeline__block" key={index}>
                  <div className="timeline__bullet"></div>
                  <div className="timeline__header">
                      <p className="timeline__timeframe">{org.year}</p>
                      <h3>{org.name}</h3>
                      <h5>{org.position}</h5>
                  </div>
              </div>
      });
    }
    return(
      <section id="about" className="s-about target-section">

          <div className="row section-intro has-bottom-sep">
              <div className="col-six tab-full text-center">
                  <img src="images/profilepic.jpg" alt="Stillmen Vallian" />
              </div>

              <div className="col-six tab-full text-left">
                  <h3>About</h3>
                  <h1>More About Me</h1>
                  <p className="lead">{shortBio}</p>
              </div>
          </div>

          <div className="row about-content">

              <div className="col-six tab-full left">
                  <h3>Howdy!</h3>

                  <p>{bio}</p>

                  <p>{bio2}</p>

                  <p>{bio3}</p>

                  <p>{bio4}</p>
              </div>

              <div className="col-six tab-full right">
                <h3>I have Got Some skills.</h3>

                <ul className="skill-bars">
                    {skills}
                </ul>

                <h3>I have Got Some editing skills.</h3>

                <ul className="skill-bars">
                    {otherSkills}
                </ul>
              </div>

          </div>

          <div className="row about-content about-content--buttons">

              <div className="col-full tab-full left">
                  <a href="#0" className="btn btn--primary full-width">Download My CV (Not Available)</a>
              </div>

          </div>

          <div className="row about-content about-content--timeline">
            <div className="col-six">
              <div className="col-full text-center">
                  <h3>Education</h3>
              </div>

              <div className="col-full tab-full left">
                  <div className="timeline">
                      {education}
                  </div>
              </div>

              <div className="col-full text-center">
                  <h3>Organization</h3>
              </div>

              <div className="col-full tab-full left">
                  <div className="timeline">

                    {organization}
                  </div>
              </div>
            </div>

            <div className="col-six">
              <div className="col-full tab-full text-center right">
                  <h3>Work Experience</h3>
                    <div className="timeline">

                        <div className="timeline__block">
                            <div className="timeline__bullet"></div>
                            <div className="timeline__header">
                                <p className="timeline__timeframe">September 2015</p>
                                <h3>Anime Festival Asia (AFA) 2015</h3>
                                <h5>Photographer (Professional Job)</h5>
                            </div>
                            <div className="timeline__desc">
                                <p>Working under an event organizer named SOZO with a photographer job. Documenting the event for 3 days in the form of photos and videos.</p>
                            </div>
                        </div>
                      </div>
              </div>

              <div className="col-full tab-full text-center right">
                <h3>Photography Experience</h3>
                  <div className="timeline">

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">September 2015</p>
                              <h3>Anime Festival Asia (AFA) 2015</h3>
                              <h5>Photographer (Professional Job)</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Working under an event organizer named SOZO with a photographer job. Documenting the event for 3 days in the form of photos and videos.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">May 2018</p>
                              <h3>DIES FTIS XXV</h3>
                              <h5>Documentation Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>FTIS (Fakultas Teknologi Informasi dan Sains) 25th anniversary.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">November 2017</p>
                              <h3>Workshop Pembelajaran Sains Integratif berbasis STEAM & IOT </h3>
                              <h5>Documentation Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>STEAM & IOT workshop held by Rumah Edukasi.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">September 2017</p>
                              <h3>CHIPS Teknik Informatika 2017</h3>
                              <h5>Documentation Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Programming competition in order to commemorate the anniversary of the department.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">May 2017</p>
                              <h3>DIES FTIS XXIV</h3>
                              <h5>Documentation Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>FTIS (Fakultas Teknologi Informasi dan Sains) 24th anniversary.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">September 2016</p>
                              <h3>DIES Teknik Informatika 20th 2016</h3>
                              <h5>Documentation Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Department 20th anniversary.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">May 2016</p>
                              <h3>Parahyangan Fair 2016 </h3>
                              <h5>Documentation Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Last event held by LKM (Lembaga Kepresidenan Mahasiswa) UNPAR 2015 / 2016.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">April 2016</p>
                              <h3>Malam Penghargaan UNPAR 2016 </h3>
                              <h5>Documentation & Publication Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Event held by LKM (Lembaga Kepresidenan Mahasiswa) UNPAR 2015 / 2016.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">March 2016</p>
                              <h3>Demosnesia 2016 </h3>
                              <h5>Documentation  Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Event held by LKM (Lembaga Kepresidenan Mahasiswa) UNPAR 2015 / 2016.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">February 2016</p>
                              <h3>Parahyangan Alumni Day 2016</h3>
                              <h5>Documentation & Publication Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Event held by LKM (Lembaga Kepresidenan Mahasiswa) UNPAR 2015 / 2016.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">May 2015</p>
                              <h3>Parahyangan Fair 2015 </h3>
                              <h5>Documentation Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Event held by LKM (Lembaga Kepresidenan Mahasiswa) UNPAR 2014 / 2015.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">April 2015</p>
                              <h3>IXPO Unpar 2015</h3>
                              <h5>Documentation & Publication Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Last event held by HMPSTIF (Himpunan Program Studi Teknik Informatika) UNPAR 2014 / 2015.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">March 2015</p>
                              <h3>Parahyangan Sports Combat 2015</h3>
                              <h5>Documentation Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Event held by LKM (Lembaga Kepresidenan Mahasiswa) UNPAR 2014 / 2015.</p>
                          </div>
                      </div>

                      <div className="timeline__block">
                          <div className="timeline__bullet"></div>
                          <div className="timeline__header">
                              <p className="timeline__timeframe">February 2015</p>
                              <h3>INITE 2014</h3>
                              <h5>Documentation Staff</h5>
                          </div>
                          <div className="timeline__desc">
                              <p>Event held by HMPSTIF (Himpunan Program Studi Teknik Informatika) UNPAR 2014 / 2015.</p>
                          </div>
                      </div>
                  </div>
              </div>
            </div>


          </div>

      </section>
    )
  }
}

export default About;
