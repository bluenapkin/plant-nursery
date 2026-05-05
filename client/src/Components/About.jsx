import React from "react";
import logo from "../img/logo.png";

const About = () => {
  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <div className="about-hero">
        <img src={logo} alt="gharslogo" className="about-logo" />
        <h1 className="about-title">About Ghars</h1>
        <p className="about-subtitle">غرس — Your premium plant destination in Oman</p>
      </div>

      {/* ── Description ── */}
      <div className="about-section">
        <h2>What is Ghars?</h2>
        <p>
          Ghars — غرس is a premium plant nursery app built for Oman.
          We offer rare fruit trees, tropical plants, and exotic species
          delivered fresh to your door.
        </p>
      </div>

      {/* ── Developers ── */}
      <div className="about-section">
        <h2>Developers</h2>
        <div className="about-dev-list">

          <div className="about-dev-card">
            <div className="about-dev-avatar">N</div>
            <div className="about-dev-info">
              <div className="about-dev-name">Nawaf</div>
              <div className="about-dev-role">Full Stack Developer</div>
            </div>
          </div>

          <div className="about-dev-card">
            <div className="about-dev-avatar">A</div>
            <div className="about-dev-info">
              <div className="about-dev-name">Abdullah</div>
              <div className="about-dev-role">Full Stack Developer</div>
            </div>
          </div>

          <div className="about-dev-card">
            <div className="about-dev-avatar">N</div>
            <div className="about-dev-info">
              <div className="about-dev-name">Nasser</div>
              <div className="about-dev-role">Full Stack Developer</div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Tech Stack ── */}
      <div className="about-section">
        <h2>Built With</h2>
        <div className="about-tech-grid">
          <span className="about-tech-tag">React</span>
          <span className="about-tech-tag">Redux Toolkit</span>
          <span className="about-tech-tag">Node.js</span>
          <span className="about-tech-tag">Express</span>
          <span className="about-tech-tag">MongoDB</span>
          <span className="about-tech-tag">Mongoose</span>
        </div>
      </div>

      {/* ── Button ── */}
      <div className="about-section" style={{ textAlign: "center" }}>
        <button className="about-contact-btn">Contact Developer</button>
      </div>

    </div>
  );
};

export default About;