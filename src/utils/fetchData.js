export const exerciseOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.NODE_ENV
        // fix it within the env class

    }
};

export const fetchData = async( url, options) => {
const response = await fetch(url, options);
const data = await response.json();

return data;

}