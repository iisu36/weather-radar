import { format } from 'date-fns'

const CurrentWeather = ({ territory }) => {
  return (
    <div className="mainWeather">
      <div className="mainWeatherLeft">
        <div>
          <h3 className="black size19">{territory.name}</h3>
          <p className="gray size13 nowrap">{territory.description}</p>
        </div>
        <div>
          <p className="black size15 nowrap">
            {format(territory.date, 'MMM do')}
          </p>
          <p className="gray size13">{format(territory.date, 'kk:mm')}</p>
        </div>
      </div>
      <div className="mainWeatherRight">
        <div className="mainWeatherRightTop">
          <img
            src={`https://openweathermap.org/img/wn/${territory.icon}@2x.png`}
            width="60"
            height="60"
            alt="pic"
          />
          <h3 className="black size26">{territory.temp}°C</h3>
        </div>
        <div className="mainWeatherRightBottom">
          <p className="gray size13">Wind: {territory.wind} m/s</p>
          <p className="gray size13">Humidity: {territory.humidity} %</p>
          <p className="gray size13 nowrap">
            Precipitation (3h): {territory.precipitation} mm
          </p>
        </div>
      </div>
    </div>
  )
}

export default CurrentWeather
