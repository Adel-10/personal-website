import { Link, NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav>
      <div className="bar">
        <Link className="brand" to="/">adel<span>@</span>mithaiwala</Link>
        <ul>
          <li><NavLink to="/projects">Projects</NavLink></li>
          <li><NavLink to="/skills">Skills</NavLink></li>
          <li><NavLink to="/education">Education</NavLink></li>
          <li><NavLink to="/experience">Experience</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
