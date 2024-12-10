import React, { useEffect, useState, useContext } from "react";
import './shows.css';
import { Link, useNavigate } from "react-router-dom"; 
import { UserContext } from './context/userContext'; 

function Shows() {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showings, setShowings] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const getFinnkinoTheaters = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const theatres = xmlDoc.getElementsByTagName("TheatreArea");
    const tempAreas = [];
 
    for (let i = 0; i < theatres.length; i++) {
      tempAreas.push({
        id: theatres[i].getElementsByTagName("ID")[0].textContent,
        name: theatres[i].getElementsByTagName("Name")[0].textContent,
      });
    }
 
    setAreas(tempAreas);
  };

  const getScheduleDates = () => {
    fetch("https://www.finnkino.fi/xml/ScheduleDates/")
      .then((response) => response.text())
      .then((xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        const dateElements = xmlDoc.getElementsByTagName("dateTime");

        const tempDates = [];
        for (let i = 0; i < dateElements.length; i++) {
          const rawDate = dateElements[i].textContent;
          tempDates.push({
            raw: rawDate,
            formatted: formatDate(rawDate),
          });
        }

        setDates(tempDates);
      })
      .catch((error) => {
        console.error("Error fetching schedule dates:", error);
      });
  };

  const getShowings = () => {
    setShowings([]); // Clear existing showings before fetching new ones

    const areaParam = selectedArea ? `area=${selectedArea}` : "";
    const dateParam = selectedDate ? `dt=${selectedDate}` : "";
    const query = [areaParam, dateParam].filter(Boolean).join("&");

    fetch(`https://www.finnkino.fi/xml/Schedule/${query ? `?${query}` : ""}`)
      .then((response) => response.text())
      .then((xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        const showingsList = xmlDoc.getElementsByTagName("Show");
 
        const showingsArray = [];
        for (let i = 0; i < showingsList.length; i++) {
          const startTime = showingsList[i].getElementsByTagName("dttmShowStart")[0].textContent;
          const formattedTime = formatDateTime(startTime);

          const theatre = showingsList[i].getElementsByTagName("Theatre")[0].textContent;

          showingsArray.push({
            movieTitle: showingsList[i].getElementsByTagName("Title")[0].textContent,
            startTime: formattedTime,
            theatre: theatre,
          });
        }

        setShowings(showingsArray);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date).replace(' ', ' at ');  
  };

  const handleProfileNavigation = () => {
    if (!user || !user.token) {
      alert("You need to be logged in to access the profile page.");
      navigate("/"); 
    } else {
      navigate("/profile"); 
    }
  };

  useEffect(() => {
    fetch("https://www.finnkino.fi/xml/TheatreAreas/")
      .then((response) => response.text())
      .then((xml) => {
        getFinnkinoTheaters(xml);
      })
      .catch((error) => {
        console.error(error);
      });

    getScheduleDates(); // Fetch the schedule dates
  }, []);

  return (
    <div>
      <header className="shows-header">
        <h1>The best movie page</h1>
      </header>

      <nav className="Profile-nav">
        <Link to="/search">
          <button className="nav-button">Search movies</button>
        </Link>
        <button className="nav-button" onClick={handleProfileNavigation}>
          Profile
        </button>
      </nav>

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
      <select onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate}>
        <option value="">-- Select Date --</option>
        {dates.map((date, index) => (
          <option key={index} value={date.raw}>
            {date.formatted}
          </option>
        ))}
      </select>

      <button className="search-button" onClick={getShowings}>
        Search
      </button>

      {showings.length > 0 && (
        <div>
          <section className="showings">
            <h3>Shows:</h3>
            <ul>
              {showings.map((show, index) => (
                <li key={index}>
                  {show.movieTitle} - {show.startTime} ({show.theatre})
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {showings.length === 0 && (
        <p>No shows available.</p>
      )}
    </div>
  );
}
 
export default Shows;

