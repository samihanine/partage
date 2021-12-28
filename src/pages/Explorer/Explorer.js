import './Explorer.scss';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Folder from './Folder/Folder';
import File from './File/File';
import Path from './Path/Path';
import { UserContext } from "context";

import { BsSearch } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { AiOutlineCloudUpload } from "react-icons/ai";

import Popup from 'components/Popup/Popup';
import Upload from 'components/Upload/Upload';
/* ------------ */

const api_key = process.env.REACT_APP_DRIVE_API_KEY;

let path = [];
let list = [];

function Explorer() {
  const [user] = useContext(UserContext);
  const [popup,setPopup] = useState(false);

  let folderId = window.sessionStorage.getItem("folder");
  if (!folderId || folderId === "undefined") folderId = user ? user.drive_key : "";

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const history = useHistory();
  const base = { id: folderId, name: "Mon Espace" };

  useEffect(() => {
    path = [ base ];
    list = [];
    
    changeFolder(base);
  }, [])

  const reload_folder = () => {
    const folder = path[path.length-1];
    if(!folder) return;

    changeFolder({ id: folder.id, name: folder.name })
    setPopup(false);
  }

  const PopupContent = () => {
    const folder = path[path.length-1];

    return <Upload end={reload_folder} custom_parent={folder ? folder.id : null} />
  }

  const httpGet = (url) => {
    setLoading(true);

    axios.get(url)
    .then(res => {
      list = res.data.files;
    })
    .catch(e => {
      console.error(e);
    })
    .then(() => {
      setLoading(false);
    })
  }

  const changeFolder = ({ id, name }) => {
    let temp = [];
    for (var i=0; i < path.length; i++) {
      if (path[i].id === id) break;
      temp.push(path[i]);
    }
    temp.push({id : id, name: name});

    path = temp;
    httpGet(`https://www.googleapis.com/drive/v3/files?q=%22${id}%22%20in%20parents&key=${api_key}`);
  }

  const triList = () => {
    // tri par odre alphabétique
    list.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

    // tri par type
    list.sort((a, b) => {
        let x = (a.mimeType === "application/vnd.google-apps.folder") ? 0 : 1;
        let y = (b.mimeType === "application/vnd.google-apps.folder") ? 0 : 1;
        if (x < y || a.name.toLowerCase() === "envoi documents a emergence") return -1;
        if (x > y) return 1;
        return 0;
    });
  }

  const Display = ({ list }) => {
    triList();
    return list.map((item,index) => {
      if (!item.name.toLowerCase().includes(search.toLowerCase()) && search !== "") return null;
      if (item.mimeType !== "application/vnd.google-apps.folder") return <File key={index} file={item} />
      return <Folder key={index} changeFolder={changeFolder} folder={item} />
    })
  }

  const sub = (list.find(item => item.mimeType === "application/vnd.google-apps.folder"));
  const canUpload = (process.env.REACT_APP_UPLOAD_EVERYWHERE === "ON" && !(sub));


  return (
    <div className="page explorer">
      <div className="appheader">
        <div className="appheader-left">
          <Path path={path} changeFolder={changeFolder} />
        </div>
        
        <div className="appheader-right">
          <div className="search card">
            <BsSearch />
            <input onChange={(e) => setSearch(e.target.value)} type="text" />
          </div>
          {/* canUpload && <span onClick={() => setPopup(true)} className="btn btn-main">
            <AiOutlineCloudUpload />
            <p>Envoyer des documents</p>
          </span> */}
          <span onClick={() => history.goBack()} className="btn btn-red">
            <CgClose />
            <p>Retour</p>
          </span>
        </div>
      </div>

      {loading ? <div className="loading">
        <img src="https://asax.fr/wp-content/plugins/interactive-3d-flipbook-powered-physics-engine/assets/images/dark-loader.gif"/>
      </div> : 
        <div className="wrapper">
          {canUpload && <div onClick={() => setPopup(true)} className="folder folder-upload">
          <AiOutlineCloudUpload />
          <p>Envoyer des documents</p>
        </div>}

        <Display list={list} />
      </div>
      }

      {popup && <Popup Content={PopupContent} close={() => setPopup(false)} title={"Envoyer des fichiers"} />}
    </div>
  );
}

export default Explorer;