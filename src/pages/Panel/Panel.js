import './Panel.scss';
import { useState, useEffect, useContext } from "react";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import EditClient from './EditClient/EditClient';
import { useHistory } from 'react-router-dom';
import { CgClose } from "react-icons/cg";
import axiosConfig from "axiosConfig";
import Popup from 'components/Popup/Popup';
import CreateClient from './CreateClient/CreateClient';
import { UserContext } from "context";

function Panel() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [popup,setPopup] = useState("");
  const [currentId, setCurrentId] = useState(-1);
  const [update,setUpdate] = useState(0);
  const [user] = useContext(UserContext);

  const history = useHistory();

  useEffect(() => {
    axiosConfig({
      method: 'get',
      url: '/user.php?token=' + user?.token + "&society_id=" + user?.society_id,
    })
    .then((response) => {
        if (response.data.err) {
          console.log(response.data.err)
        } else {
          setClients(response.data);
        }
    })
    .catch((error) => {
        console.log(error);
    })
  }, [update, user]);

  const DisplayClients = () => {
    return clients.map((client,index) => {
      if (!client.name.toLowerCase().includes(search.toLowerCase()) && search !== "") return null;

      let style = { color: client.privilege === 3 ? "#fb5f5f" : "" };
      return <div onClick={() => setCurrentId(client.id)} className="cardclient folder" key={index}> 
        <FaUser style={style} />
        <p style={style}>{client.name}</p>
      </div>
    })
  }

  const PopupAdd = () => {
    return <CreateClient clients={clients} setPopup={setPopup} setUpdate={setUpdate} setCurrentId={setCurrentId} />
  }

  return (
    <div className="page panel">
      {currentId === -1 ?<>
      <div className="appheader">
        <div>
          <div className="btn btn-main" onClick={() => setPopup("Ajouter un client")}>
              <FaUserPlus />
              <p>Ajouter un client</p>
          </div>
        </div>

        <div>
          <div className="search card">
            <BsSearch />
            <input onChange={(e) => setSearch(e.target.value)} type="text" />
          </div>
          <span onClick={() => history.goBack()} className="btn btn-red">
            <CgClose />
            <p>Retour</p>
          </span>
        </div>
      </div>
      <div className="wrapper">
        <DisplayClients />
      </div>
      </>:
      <EditClient 
        currentId={currentId} 
        setCurrentId={setCurrentId} 
        update={update} 
        setUpdate={setUpdate} 
        client={clients.find(item => item.id === currentId)} 
      />
      }

      {popup === "Ajouter un client" && <Popup Content={PopupAdd} close={() => setPopup(false)} title={popup} />}
    </div>
  );
}

export default Panel;