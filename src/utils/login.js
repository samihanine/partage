import axiosConfig from 'axiosConfig';  

const login = async (mail, password) => {

    let user = null;

    const result = await axiosConfig({
        method: 'get',
        url: `/user.php?mail=${mail}&password=${password}`,
    })

    if (result.data.length) {
        user = result.data[0];
        window.localStorage.setItem("mail", mail);
        window.localStorage.setItem("password", password);
    } else {
        window.localStorage.removeItem("mail");
        window.localStorage.removeItem("password");
    }

    return user;
}

export default login;