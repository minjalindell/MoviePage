import { useEffect, useState } from "react";

function Shows() {
  const [areas, setAreas] = useState([]); 
  const [selectedArea, setSelectedArea] = useState(""); 
  const [showings, setShowings] = useState([]);

  const getFinnkinoTheaters = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const root = xmlDoc.children;
    const theatres = root[0].children;
    const tempAreas = [];

    for (let i = 0; i < theatres.length; i++) {
      tempAreas.push({
        id: theatres[i].children[0].innerHTML,
        name: theatres[i].children[1].innerHTML,
      });
    }

    setAreas(tempAreas);
  };

  const getShowings = (areaId) => {
    if (!areaId) return;

    fetch(`https://www.finnkino.fi/xml/Schedule/?area=${areaId}`)
      .then((response) => response.text())
      .then((xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        const showingsList = xmlDoc.getElementsByTagName("Show");

        const showingsArray = [];
        for (let i = 0; i < showingsList.length; i++) {
          showingsArray.push({
            movieTitle: showingsList[i].getElementsByTagName("Title")[0]
              .textContent,
            startTime: showingsList[i].getElementsByTagName("dttmShowStart")[0]
              .textContent,
          });
        }

        setShowings(showingsArray); 
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetch("https://www.finnkino.fi/xml/TheatreAreas/")
      .then((response) => response.text())
      .then((xml) => {
        getFinnkinoTheaters(xml);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedArea) {
      getShowings(selectedArea); 
    } else {
      setShowings([]); 
    }
  }, [selectedArea]);

  return (
    <div>
      <h3>Select a Theatre Area</h3>
      <select onChange={(e) => setSelectedArea(e.target.value)} value={selectedArea}>
        <option value="">-- Select Theatre Area --</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </select>


      {selectedArea && showings.length > 0 && (
        <div>
            <section className="ajat">
          <h3>Showings in selected theatre:</h3>
          <ul>
            {showings.map((show, index) => (
              <li key={index}>
                {show.movieTitle} - {show.startTime}
              </li>
            ))}
          </ul>
          </section>
        </div>
        
      )}

      {selectedArea && showings.length === 0 && <p>No showings available for this area.</p>}
    </div>
  );
}

export default Shows;