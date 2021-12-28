import './Path.scss';

/* ------------ */

function Path({ path, changeFolder }) {

  const DisplayPath = () => {
    return path.map((item,index) => {
        return (
        <div 
          className="path-card btn" 
          style={{backgroundColor: index==0 && "#ddd"}} 
          onClick={() => changeFolder(item)} 
          key={index}>
            <p>{item.name}</p>
        </div>);
    })
  }

  return <div className="path"> 
      <DisplayPath />
  </div>

}

export default Path;