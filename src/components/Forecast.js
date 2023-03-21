import { format } from 'date-fns'

const Forecast = ({ territory }) => {
  return (
    <div className="forecasts">
      {territory.forecasts.map((forecast) => {
        return (
          <div
            key={territory.name + forecast.dt + 'forecast'}
            className="singleForecast"
          >
            <div className="forecastTop">
              <p className="gray size13">{format(forecast.date, 'kk:mm')}</p>
              <img
                src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                width="45"
                height="45"
                alt="icon describing weather conditions"
              />
              <h6 className="black size15">{forecast.temp}°C</h6>
            </div>
            <div className="forecastBottom">
              <p className="gray size10 nowrap">{forecast.wind} m/s</p>
              <p className="gray size10">{forecast.humidity} %</p>
              <p className="gray size10 nowrap">{forecast.precipitation} mm</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Forecast
