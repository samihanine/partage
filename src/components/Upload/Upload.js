import './Upload.scss';
import axiosConfig from 'axiosConfig';
import { CgClose} from "react-icons/cg";
import { useHistory } from "react-router-dom";
import axios from 'axios';

import { useEffect, useState, useContext } from 'react';
import { UserContext } from "context";

const api_key = process.env.REACT_APP_DRIVE_API_KEY;
const title_upload = "documents envoyés";
const server_url = process.env.REACT_APP_SERVER_URL;

function Upload({ custom_parent, end }) {
  const history = useHistory();
  const [user] = useContext(UserContext);
  const [state, setState] = useState(0);
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [folder, setFolder] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!custom_parent) verifUpload();
    else setFolder(custom_parent);
  }, [custom_parent]);
  
  /* -------------------------- */

  const sendMail = async () => {

    let head = `<p>Le client <b>${user.name}</b> a déposé des nouveaux documents sur son espace.</p>\n
    
    <p>Objet de l'envoie: <b>${description}</b></p>\n

    <p>Liste des documents :</p>\n<ul>`;

    let list = "";
    files.forEach(item => list += `<li>${item.name}</li>\n`)
    list = list + "</ul>";

    let text = head + list;


    try {
      const response = await axiosConfig({
        method: 'post',
        url: server_url + '/email/notif',
        headers: {
          'Content-Type': 'application/json',
          'api-key': user.client_folder
        },
        data: {
          text: text,
          mail_dest: user.gmail,
          subject: `${user.name} a déposé des documents`
        }
      });
  
      if (response.data.err) {
        console.log(response.data.err);
      } else {
        console.log("Mail bien envoyé !");
      }
    } catch (error) {
      console.log(error);
    }

    if (end) end();
  };

  useEffect(() => {
    if (progress === files.length && files.length) {
      sendMail();
      setProgress(0);
      setFiles([]);
      if (state !== 3) setState(2);
      setDescription("");
    }
  }, [progress]);

  if (state === 2 && files.length) setState(0);

  /* -------------------------- */

  const verifUpload = () => {   
    const key = user ? user.drive_key : "";
    
    axios.get(`https://www.googleapis.com/drive/v3/files?q=%22${key}%22%20in%20parents&key=${api_key}`)
    .then(res => {
      const folder = res.data.files.find(item => item.name.toLowerCase() === title_upload);
      if (folder) {
        setFolder(folder.id);
      } else {
        axiosConfig({
          method: 'post',
          url: server_url + '/document/folder',
          headers: {
            'Content-Type': 'application/json',
            'api-key': user.client_folder
          },
          data: { parent: key, title: title_upload }
        })
        .then((response) => {
            if (response.data.err) {
              console.log(response.data.err)
              setState(3);
            } else setFolder(response.data);
        })
        .catch((error) => {
          setState(3);
          console.log(error)
        });
      }
    })
    .catch(e => {
      setState(3);
      console.error(e);
    })
  }


  const send_file = (file) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("parent", folder);
    formData.append("description", description);

    axiosConfig.post(server_url + '/document', formData, { 
      headers: { 'Content-Type': 'multipart/form-data', 
      'api-key': user.client_folder 
    },
    })
    .then((response) => {
      console.log(response)
        if (response.data.err) console.log(response.data.err);
        else {
          setProgress(prevCount => prevCount + 1);
        }
    })
    .catch((error) => {
        setState(3);
        console.log(error);
    })
  }

  const verify = (event) => {
    event.preventDefault();

    setState(1);

    files.forEach(item => {
      send_file(item);
    })
  }
  
  const DisplayFiles = () => {
    return files.map((item,index) => {
      const deleteFile = () => {
        let temp = files;
        temp = temp.filter(element =>  element !== item);
        setFiles(temp);
      }

      return <div key={index} className="listfile card">
        <p>{index+1}: {item.name}</p>
        <CgClose onClick={deleteFile} />
      </div>
    })
  }

  return (
    <div className="upload submit">

      {(folder !== "") && <div className="upload-body">
        <div className="upload-list">
          {(files.length !== 0 && state === 0) && <DisplayFiles />}

          {(!files.length && state === 0) && <p className="upload-info">Ici s'affichera la liste des fichiers prêts à être envoyés.</p>}
          
          {(state === 2) && <p className="upload-success">Les documents ont bien été envoyés !</p>}
          
          {(state === 1) && <div className="loading">
            <p>{progress} / {files.length}</p>
            <div className="progressbar">
              <div style={{width: `${progress/files.length*100}%`}}></div>
            </div>
            </div>}

          {(state === 3) && <p className="upload-error">L'envoie des fichiers à échoué.</p>}
        </div>

      <form onSubmit={verify}>
          <div>
            <div>
              <label htmlFor="description">Objet de l'envoie *</label>
              <input required="required" id="description" value={description} onChange={(event) => setDescription(event.target.value)} type="text" />
            </div>

            <div>
              <input type="file" name="file" multiple onChange={(e) => setFiles([...files, ...e.target.files])}/>
            </div>
          </div>
      
          <button className="btn btn-main" type="submit" disabled={!files.length}>
            {files.length <= 1 ? "Envoyer le fichier" : `Envoyer les ${files.length} fichiers`}
          </button>
      </form>
      
      </div>}

      {(folder === "") && <div className="loading">
        <img src="https://asax.fr/wp-content/plugins/interactive-3d-flipbook-powered-physics-engine/assets/images/dark-loader.gif"/>
      </div>}


    </div>
  );
}

export default Upload;