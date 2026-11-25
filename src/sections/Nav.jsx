import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav>
      <ul className="bar">
        <li className="nav-home">
          <NavLink to="/" end>
            <span className="brand">adel<span>@</span>mithaiwala<span className="sr-only">, Home</span></span>
            <span className="home-label">Home</span>
          </NavLink>
        </li>
        <li><NavLink to="/projects">Projects</NavLink></li>
        <li><NavLink to="/skills">Skills</NavLink></li>
        <li><NavLink to="/education">Education</NavLink></li>
        <li><NavLink to="/experience">Experience</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>
    </nav>
  );
}
