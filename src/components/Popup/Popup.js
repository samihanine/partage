import './Popup.scss';
import { IoMdClose } from "react-icons/io"

function Popup({ Content, close, title }) {
  

  return (
    <div className="popup">

        <div className="popup-main card">

          <div className="popup-header" >
            <h2>{title}</h2>
            <IoMdClose onClick={e => {e.stopPropagation(); close();}}/>
          </div>

          <div className="popup-content" >
            <Content />
          </div>

        </div>
      
    </div>
  );
}

export default Popup;