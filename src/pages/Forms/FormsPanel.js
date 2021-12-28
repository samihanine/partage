import React from 'react';
import { Link } from 'react-router-dom';
import { form_list } from './data';
import './Forms.scss';

const FormsPanel = () => {
    const DisplayLink = () => {
        let list = [];
        for (const [key, item] of Object.entries(form_list)) {
            console.log(key)
            list.push({
                url: "/forms/" + key, 
                title: item.title
            })
        }
          
        return list.map((item, index) => {
            return <Link className='card-link card' key={index} to={item.url}>
                {item.title}
            </Link>
        })

    }
    return (
        <div className="forms page">
            <DisplayLink />
        </div>
    );
}

export default FormsPanel;