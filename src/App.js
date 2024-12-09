import './App.css';
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { color } from 'three/webgpu';

{/** génération aléatoire facon matrix */}
const generateRandomDelay = () => {
  // Génère une valeur aléatoire entre 1 et 3 secondes
  return `${Math.random() * 2 + 1}s`;
};

const api = {
  key: '2f454eb9b1d7dad726b298cd0e372342',
  base: 'https://api.openweathermap.org/data/2.5/',
};

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const elements = Array.from({ length: 5 }, (_, i) => ({
    text: `0 1 00${i + 1}`,
    delay: generateRandomDelay(), // Assigne un délai aléatoire à chaque élément
  }));


  /*Lever/coucher du soleil
  const sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString();
*/


  const searchPressed = () => {
    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.cod !== 200) {
          setError("Ville non trouvée");
        } else {
          setError("");
          setWeather(result);
          setIsModalOpen(true);
        }
      })
      .catch(() => {
        setError("Erreur de connexion");
        setWeather(null);
      });
  };

  

  return (
    <div className="App">
      {elements.map((el, index) => (
      <div className='containeur'>
      
      <h1 key={index} style={{ animationDelay: el.delay }} className="meteok">{el.text}</h1>
      
    
      </div>))}
      <div className='containeur2'>
      {elements.map((el, index) => (
      <div className='containeur'>
      
      <h1 key={index} style={{ animationDelay: el.delay }} className="meteok">{el.text}</h1>
      <h1 key={index} style={{ animationDelay: el.delay }} className="meteok">{el.text}</h1>
      
    
      </div>))}
      <h1 className="meteok">0<br/>0<br/>*<br/>0</h1>
      <h1 className="meteok">0<br/>1<br/>1<br/>1</h1>
      </div>

      <div className='containeur3'>
      
      <h1 className="meteok">0<br/>0<br/>|<br/>1</h1>
      <h1 className="meteok">0<br/>0<br/>|<br/>1</h1>
      </div>
      

      <header className="App-header">
        <input
          className="recherche"
          type="text"
          placeholder="Ville..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btnR" onClick={searchPressed}>
          Search
        </button>
      </header>

       {/* Modale */}
       {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)} // cloz
            >
              X
            </button>

            

              {typeof weather.main !== 'undefined' ? (
              
             <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', background: '#000000' }}>
             <h3 style={{ color: '#2c3e50' }}>Météo à {weather.name}, {weather.sys.country}</h3>

            <ol>
            <li><h3 style={{color: `#FFFFFF`}}>Température :</h3><p className='texte' style={{ color: '#FFFFFF',animationDelay: '0s' }}> {weather.main.temp}°C</p></li>
            <li><h3 style={{color: `#FFFFFF`}}>Ressentie :</h3><p className='texte' style={{ color: '#FFFFFF', animationDelay: '1s' }}> {weather.main.feels_like}°C</p></li>
            <li><h3 style={{color: `#FFFFFF`}}>Humidité :</h3><p className='texte' style={{ color: '#FFFFFF', animationDelay: '2s' }}> {weather.main.humidity}%</p></li>
            <li><h3 style={{color: `#FFFFFF`}}>Conditions :</h3><p className='texte' style={{ color: '#FFFFFF', animationDelay: '3s' }}> {weather.weather[0].main} ({weather.weather[0].description})</p></li>
           
            <li><h3 style={{color: `#FFFFFF`}}>Vent :</h3><p className='texte' style={{ color: '#FFFFFF', animationDelay: '6s' }}> {weather.wind.speed} m/s</p></li>
            <li><h3 style={{color: `#FFFFFF`}}>Latitude :</h3><p className='texte' style={{ color: '#FFFFFF', animationDelay: '7s' }}> {weather.coord.lat}</p></li>
            <li><h3 style={{color: `#FFFFFF`}}>Longitude :</h3><p className='texte' style={{ color: '#FFFFFF', animationDelay: '7s' }}> {weather.coord.lon}</p></li>
            </ol>
             
            
           </div>
            ) : (
              <p>{error}</p>
            )}
            
            
          </div>
        </div>
      )}

    
    </div>
  );
}

export default App;
