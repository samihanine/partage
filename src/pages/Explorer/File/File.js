import Popup from 'components/Popup/Popup';
import { useState } from 'react';
import './File.scss';

import { AiFillFile, AiFillFileImage, AiFillFileExcel, AiFillFilePdf, AiFillFileText, AiFillFilePpt, AiFillFileWord, AiFillFileMarkdown, AiFillFileZip, AiFillFileUnknown} from 'react-icons/ai';
import { HiDownload } from "react-icons/hi";
/* ------------ */

function File({ file }) {
  const { id, name } = file;
  const type = (name.includes('.')) ? name.split('.')[name.split('.').length-1].toLowerCase() : "";

  const [popup,setPopup] = useState(false);

  const IconSvg = ({ mimetype }) => {
    if (mimetype === "png" || mimetype === "jpeg" || mimetype === "gif" || mimetype === "bmp") return <AiFillFileImage color='#28AEEA' />
    if (mimetype === "pdf") return <AiFillFilePdf color="#F76768" />
    if (mimetype === "txt") return <AiFillFileText />

    if (mimetype === "xls" || mimetype === "xlsx") return <AiFillFileExcel color="#3A9D3F" />
    if (mimetype === "ppt" || mimetype === "pptx" || mimetype === "ppsx") return <AiFillFilePpt color="#E64A19" />
    if (mimetype === "doc" || mimetype === "docx" || mimetype === "odt") return <AiFillFileWord color="#2B5795" />
    if (mimetype === "md") return <AiFillFileMarkdown />
    if (mimetype === "zip") return <AiFillFileZip />

    if (mimetype === "") return <AiFillFileUnknown />

    return <AiFillFile className="simple" />
  }

  const PopupContent = () => {
    return <div className="popup-content">
    <iframe title="iframe" allow="autoplay" id="preview" src={`https://drive.google.com/file/d/${id}/preview`} allow="autoplay"/>
    <a href={`https://drive.google.com/u/0/uc?id=${id}&export=download`} className="btn btn-main">
      <HiDownload />
      <p>Télécharger le fichier</p>
    </a>
    </div>
  }

  return (
    <div className="file folder" onClick={() => {setPopup(true)}}>
      <IconSvg mimetype={type}/>
      
      <p>{name}</p>
      
      <div className="file-popup">
        {popup && <Popup Content={PopupContent} close={() => setPopup(false)} title={name} />}
      </div>
    </div>
  );
}

export default File;