import { Link, useLocation, useHistory } from 'react-router-dom';
import './Header.scss';
import { useEffect } from 'react';

function Header({ tree, user }) {
  let p = (user?.privilege) ? user?.privilege : -1;
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const verif = tree.find(item => item.path.split === window.location.pathname || item.path.includes(":id"));
    if (!verif) history.push("/");
    //if (user && window.location.pathname === "/login") history.push("/");
  }, [location])

  const DisplayLink = () => {
    return tree.map((item,index) => {
        if ((!item.unlock && p !== 0) || item.display !== 1) return null;
        
        if (item.icon) return <Link key={index} to={item.path}>
          <item.icon/>
        </Link>

        return <Link key={index} to={item.path}>{item.title}</Link>
    })
  }
  
  return (
    <header className="page header">
      <DisplayLink />
    </header>
  );
}

export default Header;