import './Folder.scss';
import img from "assets/opened-folder.png";

/* ------------ */

function Folder({ folder, changeFolder }) {
  const { id, name } = folder;

  return (
    <div onClick={() => changeFolder({ name: name, id: id })} className="folder">
      <img src={img} alt="icon-dossier"/>
      <p>{name}</p>
    </div>
  );
}

export default Folder;