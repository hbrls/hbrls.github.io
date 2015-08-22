var React = require('react/addons');
var EN = require('./en');
var ZH = require('./zh');


var InfoHeader = React.createClass({
  render: function () {
    return (
      <section className="info-header">
        <h1>{this.props.name}</h1>
        <p>{this.props.email}</p>
      </section>
    );
  }
});


var Education = React.createClass({
  render: function () {
    var title = "Education";
    if (this.props.lang === 'zh') {
      title = "教育背景";
    }

    var children = this.props.data.map(function (d, i) {
      return (
        <li key={i}>
          <span className="school">{d.name}, </span>
          <span className="program">{d.program}, </span>
          <span className="dates">{d.start_date} ~ {d.end_date}</span>
        </li>
      );
    });

    return (
      <section className="education">
        <h2>{title}</h2>
        <ul>
          {children}
        </ul>
      </section>
    );
  }
});


var WorkExperience = React.createClass({
  render: function () {
    var title = "Work Experience";
    if (this.props.lang === 'zh') {
      title = "工作经历";
    }

    var children = this.props.data.map(function (w, i) {
      var descriptions = w.descriptions.map(function (d, j) {
        return (
          <li key={j}>{d}</li>
        );
      });

      return (
        <li key={i}>
          <div className="info">
            <strong className="employer">{w.employer}</strong><br />
            <strong className="position">{w.position}</strong><br />
            <span className="dates">{w.start_date} ~ {w.end_date}</span>
          </div>
          <ul>
            {descriptions}
          </ul>
        </li>
      );
    });

    return (
      <section className="work-experience">
        <h2>{title}</h2>
        <ul>
          {children}
        </ul>
      </section>
    );
  }
});


var Skills = React.createClass({
  render: function () {
    var title = "Skills";
    if (this.props.lang === 'zh') {
      title = "知识/技能";
    }

    var children = this.props.data.map(function (s, i) {
      var descriptions = s.descriptions.map(function (d, j) {
        return (
          <li key={j}>{d}</li>
        );
      });

      return (
        <li key={i}>
          <div className="info">
            <strong>{s.name}</strong>
          </div>
          <ul>
            {descriptions}
          </ul>
        </li>
      );
    });

    return (
      <section className="skills">
        <h2>{title}</h2>
        <ul>
          {children}
        </ul>
      </section>
    );
  }
});


var Footer = React.createClass({
  render: function () {
    var lang = "中文";
    if (this.props.lang === 'zh') {
      lang = "EN";
    }

    return (
      <footer>
        <p>&copy; 2012 - 2015 | <a href={'#' +  this.props.lang} onClick={this.props.toggleLang}>{lang}</a></p>
      </footer>
    );
  }
});


var Resume = React.createClass({
  getInitialState: function () {
    return {
      lang: 'en'
    }
  },

  componentDidMount: function () {
    this.setState({lang: window.location.hash.substring(1) || 'en'});
  },

  _toggleLang: function () {
    if (this.state.lang === 'en') {
      this.setState({ lang: 'zh' });
    } else {
      this.setState({ lang: 'en' });
    }
  },

  render: function () {
    var data;
    if (this.state.lang === 'en') {
      data = EN;
    } else {
      data = ZH;
    }

    return (
      <div className="resume">
        <InfoHeader lang={this.state.lang} name={data.name} email={data.email} />
        <Education lang={this.state.lang} data={data.education} />
        <WorkExperience lang={this.state.lang} data={data.work_experience} />
        <Skills lang={this.state.lang} data={data.skills} />
        <Footer lang={this.state.lang} toggleLang={this._toggleLang} />
      </div>
    );
  }
});


React.render(
  <Resume />,
  document.getElementById('resume-wrapper')
);
