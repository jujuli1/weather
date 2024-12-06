import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const api = {
  key: '2f454eb9b1d7dad726b298cd0e372342',
  base: 'https://api.openweathermap.org/data/2.5/',
}

function App() {

  const  [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [error, setError] = useState("");
 
  const searchPressed = ()=> {
  fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
  .then((res) => res.json())
  .then((result) => {
    if (result.cod !== 200) {
      // Si le code de la réponse n'est pas 200 (c'est-à-dire un succès), afficher un message d'erreur
      setError("Ville non trouvée");
      
      
    } else {
      // Si la réponse est valide, mettre à jour les données météo
      setWeather(result);
    }
  })
  .catch((error) => {
    setError("Erreur de connexion");
    setWeather(null);
  });
 }

  return (
    <div className="App">
      <header className="App-header">
        {/*Header */}
        <h1>METEOK</h1>

        {/*search */}
        <input type='text' placeholder='Rechercher...'
        
        onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={searchPressed}>Recherche</button>

        
        

      {typeof weather.main !== "undefined" ? (

        <div>
          

          {/**localisation */}
        <p>{weather.name}</p>

        {/**temperatures */}
        
        <p>{weather.main.temp}°C</p>

        {/**conditions */}
        <p>{weather.weather[0].main}</p>
        <p>({weather.weather[0].description})</p>
        </div>
      ) : (
        <p>{error}</p>
      )
     }

        

        
        
      </header>
    </div>
  );
}

export default App;
