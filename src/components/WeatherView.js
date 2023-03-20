import axios from 'axios'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

const APIkey = process.env.REACT_APP_APIKEY

const CITIES = {
  660129: { name: 'Espoo', lat: 60.25, lon: 24.6667 },
  634963: { name: 'Tampere', lat: 61.4991, lon: 23.7871 },
  655194: { name: 'Jyväskylä', lat: 62.2415, lon: 25.7209 },
  650224: { name: 'Kuopio', lat: 62.8924, lon: 27.677 },
}

const cityIds = {
  Espoo: 660129,
  Tampere: 634963,
  Jyväskylä: 655194,
  Kuopio: 650224,
}

const options = ['Kaikki kaupungit', 'Espoo', 'Tampere', 'Jyväskylä', 'Kuopio']

const get3hPrecipitation = (object) => {
  if (object.rain) {
    return object.rain['3h'].toFixed()
  } else if (object.snow) {
    return object.snow['3h'].toFixed()
  } else {
    return 0
  }
}

const WeatherView = () => {
  const [viewLocations, setViewLocations] = useState(options[0])
  const [weatherData, setWeatherData] = useState({})

  useEffect(() => {
    let weatherObject = {}
    const fecthData = async () => {
      const weatherPromises = []
      const forecastPromises = []
      let locations = []
      if (viewLocations === 'Kaikki kaupungit') {
        locations = CITIES
      } else {
        const key = cityIds[viewLocations]
        locations = { key: CITIES[key] }
      }
      for (const location of Object.values(locations)) {
        const weatherRequest = axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${APIkey}`
        )
        weatherPromises.push(weatherRequest)
        const forecastRequest = axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${APIkey}`
        )
        forecastPromises.push(forecastRequest)
      }
      const weatherResponse = await Promise.all(weatherPromises)
      weatherResponse.forEach((index) => {
        const object = index.data
        const name = CITIES[object.id].name
        const temp = (object.main.temp - 273.15)
          .toFixed(1)
          .replace('-0.0', '0.0')
        const date = new Date(object.dt * 1000)
        weatherObject[name] = {
          name: name,
          dt: object.dt,
          date: date,
          temp: temp,
          humidity: object.main.humidity,
          description: object.weather[0].description,
          icon: object.weather[0].icon,
          wind: object.wind.speed,
        }
      })
      const forecastResponse = await Promise.all(forecastPromises)
      forecastResponse.forEach((index) => {
        const object = index.data
        const name = CITIES[object.city.id].name
        const startIndex = object.list.findIndex(
          (index) => weatherObject[name].dt < index.dt + 3 * 60 * 60
        )
        const forecastArray = []
        const forecasts = object.list.slice(startIndex, startIndex + 6)

        for (let forecast of forecasts) {
          const date = new Date(forecast.dt * 1000)
          const temp = (forecast.main.temp - 273.15)
            .toFixed()
            .replace('-0', '0')
          const precipitation = get3hPrecipitation(forecast)

          const forecastObject = {
            dt: forecast.dt,
            date: date,
            temp: temp,
            precipitation: precipitation,
            humidity: forecast.main.humidity,
            icon: forecast.weather[0].icon,
            wind: forecast.wind.speed,
          }
          forecastArray.push(forecastObject)
        }
        weatherObject[name] = {
          ...weatherObject[name],
          precipitation: forecastArray[0].precipitation,
          forecasts: forecastArray.slice(1),
        }
      })
      setWeatherData(weatherObject)
    }

    fecthData()
  }, [viewLocations])

  if (Object.keys(weatherData).length === 0) return <div>loading...</div>

  return (
    <main>
      <div className="dropMenu">
        <select
          value={viewLocations}
          onChange={(event) => setViewLocations(event.target.value)}
        >
          {options.map((option) => {
            return (
              <option
                key={option + 'option'}
                value={option}
                className="black-13"
              >
                {option}
              </option>
            )
          })}
        </select>
      </div>

      {Object.keys(weatherData).map((objectKey) => {
        const territory = weatherData[objectKey]

        return (
          <div key={territory.name + territory.dt} className="territory">
            <div className="mainWeather">
              <div className="mainWeatherLeft">
                <div>
                  <h3 className="black-19">{territory.name}</h3>
                  <p
                    className="gray-13"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {territory.description}
                  </p>
                </div>
                <div>
                  <p
                    className="black-15"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {format(territory.date, 'MMM do')}
                  </p>
                  <p className="gray-13">{format(territory.date, 'kk:mm')}</p>
                </div>
              </div>
              <div className="mainWeatherRight">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'end',
                  }}
                >
                  <img
                    src={`https://openweathermap.org/img/wn/${territory.icon}@2x.png`}
                    width="60"
                    height="60"
                    alt="pic"
                  />
                  <h3 className="black-26">{territory.temp}°C</h3>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <p className="gray-13">Wind: {territory.wind} m/s</p>
                  <p className="gray-13">Humidity: {territory.humidity} %</p>
                  <p
                    className="gray-13"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Precipitation (3h): {territory.precipitation} mm
                  </p>
                </div>
              </div>
            </div>
            <div className="forecasts">
              {territory.forecasts.map((forecast) => {
                return (
                  <div
                    key={territory.name + forecast.dt + 'forecast'}
                    className="singleForecast"
                  >
                    <div className="forecastTop">
                      <p className="gray-13">
                        {format(forecast.date, 'kk:mm')}
                      </p>
                      <img
                        src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                        width="45"
                        height="45"
                        alt="pic"
                      />
                      <h6 className="black-15">{forecast.temp}°C</h6>
                    </div>
                    <div className="forecastBottom">
                      <p
                        className="gray-10"
                        style={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {forecast.wind} m/s
                      </p>
                      <p className="gray-10">{forecast.humidity} %</p>
                      <p
                        className="gray-10"
                        style={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {forecast.precipitation} mm
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </main>
  )
}

export default WeatherView
