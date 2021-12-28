import './Espace.scss';
import { FaFolderOpen, FaWpforms } from "react-icons/fa";
import { ImFolderPlus } from "react-icons/im";
import { IoMdLogOut } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";
import { BiSpreadsheet } from "react-icons/bi";

import { UserContext } from "context";
import { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import Popup from 'components/Popup/Popup';
import Upload from 'components/Upload/Upload';

function Espace() {
  const [user, setUser] = useContext(UserContext);
  const privilege = user ? user.privilege : -1;
  const history = useHistory();
  const [popup,setPopup] = useState(false);

  const PopupContent = () => {
    return <Upload />
  }

  return (
    <div className="page espace">

      <h2>Bienvenue {user.name} !</h2>
      
      <div className="espace-wrapper">

      {(privilege == 2 || privilege == 0) && <div onClick={() => { window.sessionStorage.setItem("folder",user.drive_key); history.push("explorer"); }} className="espace-card card">
        <FaFolderOpen color="#F5CD85" />
        <h2>Mes fichiers</h2>
      </div>}

      {(privilege == 2 || privilege == 0) && <div onClick={() => { history.push("/forms"); }} className="espace-card card">
        <FaWpforms color="green" />
        <h2>Formulaire</h2>
      </div>}

      {((privilege == 2 || privilege == 0) && process.env.REACT_APP_UPLOAD_EVERYWHERE !== "ON") && 
        <div onClick={() => setPopup(true)}  className="espace-card card">
        <ImFolderPlus color="#b3dff2" />
        <h2>Envoyer des documents</h2>
      </div>}

      {(privilege == 1 || privilege == 0) && <div onClick={() => history.push("/panel")}  className="espace-card card">
        <RiAdminFill color="#FDCF78" />
        <h2>Administration des clients</h2>
      </div>}

      {((privilege == 4 || privilege == 0) && process.env.REACT_APP_UPLOAD_COMPTABLE == "ON") && <div onClick={() => history.push("/compta")}  className="espace-card card">
        <BiSpreadsheet color="#29e8b8" />
        <h2>Comptabilité des clients</h2>
      </div>}

      <div onClick={() => {
        setUser(null); 
        window.localStorage.removeItem("mail");
        window.localStorage.removeItem("password");
        //history.push("/login"); 
        }} className="espace-card card">
        <IoMdLogOut color="#e24e4e" />
        <h2>Se déconnecter</h2>
      </div>

      </div>

      {popup && <Popup Content={PopupContent} close={() => setPopup(false)} title={"Envoyer des fichiers"} />}
      
    </div>
  );
}

export default Espace;