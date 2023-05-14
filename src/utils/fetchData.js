export const exerciseOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        'X-RapidAPI-Key': '9beeaabc65msh7943379eee53d21p11afc2jsna85799c2c2c2'
        // fix it within the env class

    }
};

export const fetchData = async( url, options) => {
const response = await fetch(url, options);
const data = await response.json();

return data;

}