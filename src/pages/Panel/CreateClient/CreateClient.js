import { useState, useEffect, useContext } from "react";
import './CreateClient.scss';
import axiosConfig from "axiosConfig";
import { FaUserPlus } from "react-icons/fa";
import { UserContext } from "context";
import structures from "./structure";

const server_url = process.env.REACT_APP_SERVER_URL;

const CreateClient = ({ setPopup, setUpdate, setCurrentId, clients }) => {
    const [user] = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [clientName, setClientName] = useState("")

    const handleError = (msg) => {
      alert(msg);
      close();
    }

    const close = () => {
      setLoading(false);
      setPopup(""); 
    }

    const populate_folder = async (parent_id, folder) => {
      const id = await create_folder(parent_id, folder.name);
    
      if (folder.content) {
        for (let item of folder.content) {
          populate_folder(id, item);
        }
      }

      return id;
    }
    
    const create_folder = async (parent, title) => {
      const result = await axiosConfig({
        method: 'post',
        url: server_url + '/document/folder',
        headers: {
          'Content-Type': 'application/json',
          'api-key': user.client_folder
        },
        data: { parent: parent, title: title }
      });
    
      return result.data;
    }

    const createUser = async () => {
      const structure = structures[user.structure];
      const id = await populate_folder(user.client_folder, { name: clientName, content: structure });

      const response = await axiosConfig({
        method: 'post',
        url: '/user.php?token=' + user.token,
        data: {
          name: clientName,
          password: Math.floor(Math.random() * 1000000),
          drive_key: id,
          privilege: 2,
          society_id: user.society_id,
          mail: ""
        }
      })

      if (response.data.err) {
        handleError("Un client avec ce nom existe déjà.");
      } else {
        setCurrentId(parseInt(response.data));
        setUpdate(old => old + 1);
        close();
      }
    }

    const submit = (e) => {
      e.preventDefault();
      const op = clients.find(item => item.name == clientName);
      if (op) {
        alert("Un client avec cette dénomination existe déjà.");
        return;
      }

      setLoading(true);
      createUser();
    }

    return <form className="panel-add" onSubmit={submit}>
        <FaUserPlus />
        
        {loading ? <div className="loading">
        <img src="https://asax.fr/wp-content/plugins/interactive-3d-flipbook-powered-physics-engine/assets/images/dark-loader.gif"/>
        </div> : <>
        <div>
          <label htmlFor="input-add">Nom du client: </label>
          <input value={clientName} onChange={e => setClientName(e.target.value)} id="input-add" required type="text"/>
        </div>

        <button type="submit" className="btn btn-main">Confirmer</button>
        </>}
      </form>
  }

export default CreateClient;