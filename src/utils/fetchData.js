export const exerciseOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        'X-RapidAPI-Key': '8a728a8cd5msh78882717985ecb6p1a2723jsnb943d0ac0fc8'
        // fix it within the env class

    }
};

export const youtubeOptions = {
    method: 'GET',
   
    headers: {
      'X-RapidAPI-Key': '6b14f01acamshaab86d1944a63d1p1fd522jsn040a6d9bf0a0',
      'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
    }
  };
export const fetchData = async( url, options) => {
const response = await fetch(url, options);
const data = await response.json();

return data;

}