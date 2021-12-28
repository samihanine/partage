import './Login.scss';
import { useHistory } from "react-router-dom";
import { useState , useContext} from "react";
import { UserContext } from "context";

import login from 'utils/login';

function Login() {
  const history = useHistory();
  const [error, setError] = useState(false);
  const [, setUser] = useContext(UserContext);

  const connect = async (mail, password) => {
      const result = await login(mail, password);
      if (result) {
        setUser(result);
        history.push("/");
      } else {
        setError("Email ou mot de passe non valide");
      }
  }

  const verifyInput = (e) => {
    e.preventDefault();
    connect(document.getElementById("mail").value, document.getElementById("password").value);
  }

  return (
    <div className="login">

      <form onSubmit={verifyInput} className="card">

        <h2>Connectez-vous à votre espace</h2>
        <div>
          <label htmlFor="mail">Votre adresse mail</label>
          <input type="email" id="mail" placeholder="Adresse email" required autoComplete="mail" />
        </div>
        
        <div>
          <label htmlFor="password">Votre mot de passe</label>
          <input type="password" id="password" minLength="6" placeholder="Mot de passe" required autoComplete="current-password" />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;