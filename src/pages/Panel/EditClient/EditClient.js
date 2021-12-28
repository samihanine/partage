import './EditClient.scss';
import { CgClose } from "react-icons/cg";
import { ImFolder } from "react-icons/im";
import { IoNotifications } from "react-icons/io5";
import { BsFillTrashFill } from "react-icons/bs";
import Popup from 'components/Popup/Popup';
import { useState, useContext } from "react";
import { useHistory} from "react-router-dom";
import axiosConfig from "axiosConfig";
import { UserContext } from "context";

import { AiOutlineWarning } from "react-icons/ai";
import TextareaAutosize from 'react-textarea-autosize';

const baseMail = "Des nouveaux documents sont disponibles dans votre espace. \n\nNom Dossier : xxxx\nNom fichier : xxxx\n\nCliquer sur le lien suivant pour accéder à votre espace : \nhttps://www.emergenceentreprise.com/espace-client\n\n----------\nCeci est un mail automatique. Veuillez ne pas répondre à ce message.";
const server_url = process.env.REACT_APP_SERVER_URL;

function EditClient({ client, currentId, setCurrentId, update, setUpdate }) {
  const [user] = useContext(UserContext);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [mail, setMail] = useState(null);
  const [drive_key, setDrive_key] = useState(null);
  const [privilege, setPrivilege] = useState(null);

  const [popup,setPopup] = useState("");
  const [textMail,setTextMail] = useState(baseMail);

  const history = useHistory();

  const PopupDelete = () => {

    const deleteClient = () => {
      axiosConfig({
        method: 'delete',
        url: '/user.php?token=' + user.token,
        data: {
          id: currentId
        }
      })
      .then((response) => {
          if (response.data.err) {
            console.log(response.data.err)
          }
      })
      .catch((error) => {
          console.log(error);
      })
      .then(() => {
        setPopup("");
        setCurrentId(-1);
        setUpdate(update+1);
      })
    }

    return <div className="edit-delete">
        <AiOutlineWarning />
        <p>La suppression du client est définitive. </p>
        <button className="btn btn-red" onClick={deleteClient}>Confirmer</button>
      </div>
  }

  const PopupNotif = () => {

    const sendNotif = () => {
      axiosConfig({
        method: 'post',
        url: server_url + '/email/notif',
        headers: {
          'Content-Type': 'application/json',
          'api-key': user.client_folder
        },
        data: {
          text: textMail,
          mail_dest: mail,
          subject: "Des nouveaux documents sont disponibles sur votre espace."
        }
      })
      .then((response) => {
          if (response.data.err) {
            console.log(response.data.err);
          } else {
            console.log("Mail bien envoyé !");
          }
      })
      .catch((error) => {
          console.log(error);
      })
    }

    return <div className="edit-notif">
      <label>Contenu du mail à envoyer</label>
      <TextareaAutosize type="text" value={textMail} onChange={e => setTextMail(e.target.value)} placeholder={textMail} />
      <button className="btn btn-blue" onClick={() => { sendNotif(); setPopup(""); }}>Envoyer</button>
    </div>
  }

  if (!name) {
    if (client) {
      setName(client.name || "");
      setPassword(client.password);
      setMail(client.mail);
      setDrive_key(client.drive_key);
      setPrivilege(client.privilege)
    }
    return <></>
  }

  const modifClient = () => {
    axiosConfig({
      method: 'put',
      url: '/user.php?token=' + user.token,
      data: {
        id: currentId,
        name: name,
        mail: mail,
        password: password,
        drive_key: drive_key,
        privilege: privilege
      }
    })
    .then((response) => {
        if (response.data.err) {
          console.log(response.data.err)
        }

        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    })
    .then(() => {
      setUpdate(update+1);
    })
  }

  const verifyInput = (e) => {
    e.preventDefault();

    modifClient();
  }

  let diff = client ? (name !== client.name || password !== client.password || mail !== client.mail || drive_key !== client.drive_key || privilege != client.privilege) : false;

    return <div className="editclient submit">
            <div className="appheader">
        <div className="">
          <span className="btn btn-beige" onClick={() => { window.sessionStorage.setItem("folder",client.drive_key); history.push("/explorer")}}>
            <ImFolder  />
            <p>Accéder au documents</p>
          </span>

          <span className="btn btn-blue hidden" onClick={() => setPopup("Envoyer une notification") }>
            <IoNotifications />
            <p>Envoyer une notification</p>
          </span>

          <span className="btn btn-red" onClick={() => { setPopup("Supprimer un client")} }>
            <BsFillTrashFill />
            <p>Supprimer le client</p>
          </span>
        </div>

        <div className="">
          <span className="btn btn-red" onClick={() => setCurrentId(-1)}>
              <CgClose />
              <p>Retour</p>
            </span>
        </div>
      </div>

        <form className="card" onSubmit={verifyInput}>
          <h2>Informations sur {name.charAt(0).toUpperCase() + name.slice(1)}</h2>

          <div>
            <div>
              <label htmlFor="edit-name">Dénomination</label>
              <input type="text" onChange={e => setName(e.target.value)} id="edit-name" value={name} />
            </div>
            <div>
              <label htmlFor="edit-mail">Mail</label>
              <input type="text" required onChange={e => setMail(e.target.value)} id="edit-mail"  value={mail} />
            </div>
            <div>
              <label htmlFor="edit-password">Mot de passe</label>
              <input type="text" required onChange={e => setPassword(e.target.value)} id="edit-password"  value={password} />
            </div>
            <div style={{display: "none"}}>
              <label htmlFor="edit-key">Clé drive</label>
              <input type="text" onChange={e => setDrive_key(e.target.value)} id="edit-key" value={drive_key} />
            </div>
            <div>
              <label htmlFor="edit-privilege">Privilège</label>
              <select value={privilege} onChange={e => setPrivilege(e.target.value)} id="edit-privilege">
                <option value={2}>Client</option>
                <option value={3}>Restreint</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-main" disabled={!diff}>Enregistrer les modifications</button>
        </form>

      {popup === "Supprimer un client" && <Popup Content={PopupDelete} close={() => setPopup("")} title={popup} />}
      {popup === "Envoyer une notification" && <Popup Content={PopupNotif} close={() => setPopup("")} title={popup} />}
    </div>
}

export default EditClient;