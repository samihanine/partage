import React, { useEffect, useState, useContext } from 'react';
import './Forms.scss';
import { form_list } from './data';
import axiosConfig from 'axiosConfig';
import { UserContext } from 'context';
import { useParams } from 'react-router';

const server_url = process.env.REACT_APP_SERVER_URL;

const DisplayInputs = ({ data, inputs, setInputs }) => {
    return data.map((input, index) => {
        const Label = () => <label htmlFor={index}>{input.title} {input.required && <b>*</b>}</label>
        const handleChange = (e) => {
            if (input.type == "file") return;
            const old_inputs = {...inputs};
            old_inputs[input.name] = e.target.value;
            setInputs({...old_inputs});
        }

        const value = inputs[input.name] || "";
        if (input.options.length) input.type = "select";

        if (input.condition) {
            const id = index + input.condition;
            const targetData = data.find((item, i) => i == id);
            const targetValue = inputs[targetData.name];

            let operation = false;
            for(const item of input.conditionValue) {
                if (targetValue == item) operation = true;
            }
            if (!operation) return null;
        }

        switch (input.type) {
            case "hidden":
                return null;
            case "title":
                return <h2 key={index}>{input.title}</h2>
            case "select":
                return (<div key={index}>
                    <Label />
                    <select id={index} onChange={handleChange} required={input.required} value={value}>
                        <option value={""}>- Choisir parmi les options -</option>
                        {input.options.map((option, i) => <option key={i} value={option}>{option}</option>)}
                    </select>
                </div>)
            case "textarea":
                return (<div key={index}>
                    <Label />
                    <textarea id={index} onChange={handleChange} required={input.required} value={value}></textarea>
                </div>)
            default:
                return <div key={index}>
                <Label />
                <input 
                id={index}
                type={input.type} 
                value={input.type == "file" ? undefined : value} 
                onChange={handleChange}
                required={input.required} 
                minLength={input.minLength}
                maxLength={input.maxLength}
                pattern={input.pattern}
                placeholder={input.placeholder}
                accept="image/png, image/jpeg, application/pdf"
                />
            </div>
        }
    })
}

async function readFileAsDataURL(file) {
    let result_base64 = await new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => resolve(fileReader.result);
        fileReader.readAsDataURL(file);
    });

    return result_base64;
}

const Forms = () => {
    const [user] = useContext(UserContext);
    const [inputs, setInputs] = useState({})
    const { id } = useParams();
    const [data, setData] = useState(form_list[id]?.data || [])

    useEffect(() => {
        const form = form_list[id];
        if (form) {
            const data_set = {};
            for (const item of form.data) {
                if (item.type != "title" && item.type != "file") data_set[item.name] = '';
            }
            const local = window.localStorage.getItem("form-" + form.title);
            if (local && local != '' && local != 'undifined') {
                setInputs(JSON.parse(local));
            } else {
                setInputs(data_set);
            }
            
            setData(form_list[id].data);
        }
    }, [id])

    useEffect(() => {
        const info = form_list[id];
        if (info) {
            window.localStorage.setItem("form-" + info.title, JSON.stringify(inputs));
        }
    }, [inputs, id])
    
    const submit = async e => {
        e.preventDefault();
        
        const files = [];
        const files_list = data.filter(item => item.type == "file");
        for (const item of files_list) {
            const file = document.getElementById(item.id)?.files[0];
            let base64;
            if (file) {
                base64 = await readFileAsDataURL(file);

                const content = base64.split(",")[1];
                const extension = base64.match(/[^:/]\w+(?=;|,)/)[0].replace(".", "");

                files.push({
                    filename: item.title + '.' + extension,
                    content: content,
                    encoding: 'base64'
                })
            }
        }

        axiosConfig({
            method: 'post',
            url: server_url + '/email/forms',
            headers: {
              'Content-Type': 'application/json',
              'api-key': user.client_folder
            },
            data: {
                json_xlsx: inputs,
                files: files,
                infos: {
                    title: "DPAE",
                    client: user.name,
                    mail_dest: "contact.emergence@gmail.com",
                }
            }
          })
          .then((response) => {
              if (response.data.err) {
                console.log(response.data.err);
              } else {
                alert("Le formulaire a bien été envoyé !");
                const info = form_list[id];
                if (info) {
                    window.localStorage.removeItem("form-" + info.title);
                }
                window.location.reload();
              }
          })
          .catch((error) => {
              console.log(error);
          })
    }


    return (
        <div className="forms page">

            <form onSubmit={submit} className='card'>

                <h1>{form_list[id]?.title}</h1>

                <DisplayInputs data={data} inputs={inputs} setInputs={setInputs} />

                <button className='btn btn-main'>Valider</button>

                <p><b onClick={submit}>*</b> Champs obilgatoires</p>
            </form>
        </div>
    );
}

export default Forms;