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

  // Effet pour initialiser la scène Three.js
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("three-container").appendChild(renderer.domElement);

    // Moon
    const geometry = new THREE.SphereGeometry(0.3, 32, 32)
    const texture = new THREE.TextureLoader().load('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5MQZS7B0LbbZ4LJgK-djWwW3oczycATcJ3w&s', () => {
      console.log("Texture chargée avec succès");
  }, undefined, (err) => {
      console.error("Erreur lors du chargement de la texture :", err);
  });
    const material = new THREE.MeshPhongMaterial({map: texture})
    const cube = new THREE.Mesh(geometry, material);
    const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    scene.add(cube);
    

    // Caméra
    camera.position.z = 5;


    // Variables pour le mouvement circulaire
    let angle = 0; // Angle initial en radians
    const radius = 4; // Rayon du cercle
    const speed = 0.001; // Vitesse de rotation (radians par frame)

    // Animation
    function animateRotate() {
        // Calcul des nouvelles coordonnées
        angle += speed; // Incrémenter l'angle à chaque frame
        const x = radius * Math.cos(angle); // Calcul de la position x
        const y = radius * Math.sin(angle); // Calcul de la position y

        cube.position.set(x, y, 0); // Mettre à jour la position de la sphère

        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animateRotate);

    // Animation
    const animate = () => {
      cube.rotation.x += 0.002;
      cube.rotation.y += 0.002;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cycle de luminosité
    let increasing = true; // Variable pour suivre la direction (augmentation ou diminution)

    setInterval(() => {
        if (increasing) {
          ambientLight.intensity = Math.max(ambientLight.intensity - 0.3, 0); // Diminue jusqu'à 0
            if (ambientLight.intensity === 0) increasing = false; // Inverse la direction
            
        } else {
          ambientLight.intensity = Math.min(ambientLight.intensity + 1, 4); // Augmente jusqu'à 4
            if (ambientLight.intensity === 4) increasing = true; // Inverse la direction
            
        }
        console.log("Intensité actuelle de la lumière :", ambientLight.intensity);
    }, 4500);

    // Nettoyer la scène lors du démontage
    return () => {
      document.getElementById("three-container").removeChild(renderer.domElement);
    };
  }, []);

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
          Meteok
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

      {/* Conteneur pour le rendu Three.js */}
      <div id="three-container" ></div>
    </div>
  );
}

export default App;
