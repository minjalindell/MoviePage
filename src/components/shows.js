
import { useEffect, useState } from "react";

function Shows() {
  const [areas, setAreas] = useState([]); 
  const [selectedArea, setSelectedArea] = useState(""); 
  const [selectedDate, setSelectedDate] = useState(""); 
  const [showings, setShowings] = useState([]);

  const getFinnkinoTheaters = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const root = xmlDoc.children;
    const theatres = root[0].children;
    const tempAreas = [];
  
    for (let i = 0; i < theatres.length; i++) {
      const id = theatres[i].children[0].innerHTML;
      const name = theatres[i].children[1].innerHTML;
  
      if (name.includes("valitse alue") || name.includes("teatteri")) {
        continue;
      }
  
      tempAreas.push({ id, name });
    }
  
    setAreas(tempAreas);
  };

  const getShowings = (areaId, date) => {
    if (!areaId) return;

    const dateQuery = date ? `&dt=${date}` : ""; 
    fetch(`https://www.finnkino.fi/xml/Schedule/?area=${areaId}${dateQuery}`)
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
            startTime: formatDateTime(
              showingsList[i].getElementsByTagName("dttmShowStart")[0]
                .textContent
            ),
          });
        }

        setShowings(showingsArray); 
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) + " klo " + date.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" });
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
      getShowings(selectedArea, selectedDate); 
    } else {
      setShowings([]); 
    }
  }, [selectedArea, selectedDate]);

  const handleDateChange = (e) => {
    const rawDate = e.target.value;
    const formattedDate = formatDate(rawDate);
    setSelectedDate(formattedDate);
  };

  const formatDate = (rawDate) => {
    const [year, month, day] = rawDate.split("-");
    return `${day}.${month}.${year}`;
  };

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

      <h3>Select a Date</h3>
      <input
        type="date"
        onChange={handleDateChange}
        disabled={!selectedArea}
      />

      {selectedArea && showings.length > 0 && (
        <div>
          <h3>Showings in selected theatre:</h3>
          <ul>
            {showings.map((show, index) => (
              <li key={index}>
                {show.movieTitle} - {show.startTime}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedArea && showings.length === 0 && <p>No showings available for this area and date.</p>}
    </div>
  );
}

export default Shows;
