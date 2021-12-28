import './Compta.scss';
import { useEffect, useState, useContext } from "react";
import axiosConfig from "axiosConfig";
import { FaUser } from "react-icons/fa";
import { useHistory } from 'react-router';
import { CgClose } from 'react-icons/cg';
import { UserContext } from "context";

const api_key = process.env.REACT_APP_DRIVE_API_KEY;
const compta_name = "comptable";

function Compta() {
  const [clients, setClients] = useState([]);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [user] = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    
    get_compta();
  }, []);

  const get_compta = () => {
    axiosConfig({
      method: 'get',
      url: '/user.php?token=' + user.token,
    })
    .then((response) => {
        if (response.data.err) {
          console.log(response.data.err)
        } else {
          let tab = response.data;

          tab.forEach((item) => {
            axiosConfig.get(`https://www.googleapis.com/drive/v3/files?q=%22${item.drive_key}%22%20in%20parents&key=${api_key}`)
            .catch(e => {
              console.error(e);
            })
            .then(res => {
              if (res && res.data.files) {
                let tabres = res.data.files;
                let folder_upload = tabres.find(item => item.name.toLowerCase() === compta_name);
                if (folder_upload) setClients(oldArray => [...oldArray, { name: item.name, key: folder_upload.id}]);
              }
            })
          })
        }
    })
    .catch((error) => {
        console.log(error);
    })
    .then(() => {
      setLoading(false);
    })
  }

  const DisplayClient = () => {
    return clients.map((item, index) => {
      if (item.key == "" || !item.key) return null;
      return <div onClick={() => { window.sessionStorage.setItem("folder",item.key); history.push("/explorer") }} className="cardclient folder" key={index}> 
        <FaUser />
        <p>{item.name}</p>
      </div>
    })
  }

  return (
    <div className="page compta">

      <div className="appheader">
        <div className="appheader-left">
          <h2>Dossier Financier des clients</h2>
        </div>

        <div className="appheader-right">
          <span onClick={() => history.goBack()} className="btn btn-red">
            <CgClose />
            <p>Retour</p>
          </span>
        </div>
      </div>
      {loading ? <div className="loading">
        <img src="https://asax.fr/wp-content/plugins/interactive-3d-flipbook-powered-physics-engine/assets/images/dark-loader.gif"/>
      </div>
      :
      <div className="wrapper">
        {clients && <DisplayClient/>}
      </div>
      }


      
    </div>
  );
}

export default Compta;