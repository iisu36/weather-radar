import axios from 'axios'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

const APIkey = process.env.REACT_APP_APIKEY

const CITIES = {
  Espoo: { lat: 60.25, lon: 24.6667 },
  Tampere: { lat: 61.4991, lon: 23.7871 },
  Jyväskylä: { lat: 62.2415, lon: 25.7209 },
  Kuopio: { lat: 62.8924, lon: 27.677 },
}

const options = ['Kaikki kaupungit', 'Espoo', 'Tampere', 'Jyväskylä', 'Kuopio']

const WeatherView = () => {
  const [viewLocations, setViewLocations] = useState(options[0])
  const [weatherArray, setWeatherArray] = useState([])
  const [forecastArray, setForecastArray] = useState([])

  useEffect(() => {
    setWeatherArray([])
    setForecastArray([])
    const weatherPromises = []
    const forecastPromises = []
    let locations = []
    if (viewLocations === 'Kaikki kaupungit') {
      locations = ['Espoo', 'Tampere', 'Jyväskylä', 'Kuopio']
    } else {
      locations = [viewLocations]
    }
    locations.forEach((location) => {
      const city = CITIES[location]
      const weatherRequest = axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${APIkey}`
      )
      weatherPromises.push(weatherRequest)
      const forecastRequest = axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${APIkey}`
      )
      forecastPromises.push(forecastRequest)
    })
    Promise.all(weatherPromises).then((response) => {
      const array = []
      response.forEach((index) => {
        array.push(index.data)
      })
      setWeatherArray(array)
    })
    Promise.all(forecastPromises).then((response) => {
      const array = []
      response.forEach((index) => {
        array.push(index.data)
      })
      setForecastArray(array)
    })
  }, [viewLocations])

  if (weatherArray.length === 0 || forecastArray.length === 0)
    return <div>loading...</div>

  const forecastData = forecastArray.map((city) => {
    const weatherDate = weatherArray.find(
      (index) => index.name === city.city.name
    ).dt
    const startIndex = city.list.findIndex(
      (index) => weatherDate < index.dt + 10800
    )
    const forecasts = city.list.slice(startIndex, startIndex + 6)
    return { city: city.city.name, forecasts: forecasts }
  })

  const getPrecipitation = (cityName) => {
    const { forecasts } = forecastData.find((index) => index.city === cityName)
    if (forecasts[0].rain) return forecasts[0].rain['3h']
    else if (forecasts[0].snow) return forecasts[0].snow['3h']
    return 0
  }

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
      {weatherArray.map((territory) => {
        const date = new Date(territory.dt * 1000)

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
                    {territory.weather[0].description}
                  </p>
                </div>
                <div>
                  <p
                    className="black-15"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {format(date, 'MMM do')}
                  </p>
                  <p className="gray-13">{format(date, 'kk:mm')}</p>
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
                    src={`https://openweathermap.org/img/wn/${territory.weather[0].icon}@2x.png`}
                    width="60"
                    height="60"
                    alt="pic"
                  />
                  <h3 className="black-26">
                    {} {(territory.main.temp - 273.15).toFixed(1)}°C
                  </h3>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <p className="gray-13">Wind: {territory.wind.speed} m/s</p>
                  <p className="gray-13">
                    Humidity: {territory.main.humidity} %
                  </p>
                  <p
                    className="gray-13"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Precipitation (3h):{' '}
                    {getPrecipitation(territory.name).toFixed(0)} mm
                  </p>
                </div>
              </div>
            </div>
            <div className="forecasts">
              {forecastData
                .find((obj) => obj.city === territory.name)
                .forecasts.slice(1)
                .map((forecast) => {
                  const date = new Date(forecast.dt * 1000)

                  let precipitation = ''

                  if (forecast.rain) {
                    precipitation = forecast.rain['3h']
                  } else if (forecast.snow) {
                    precipitation = forecast.snow['3h']
                  } else {
                    precipitation = 0
                  }

                  return (
                    <div
                      key={territory.name + forecast.dt + 'forecast'}
                      className="singleForecast"
                    >
                      <div className="forecastTop">
                        <p className="gray-13">{format(date, 'kk:mm')}</p>
                        <img
                          src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                          width="45"
                          height="45"
                          alt="pic"
                        />
                        <h6 className="black-15">
                          {(forecast.main.temp - 273.15).toFixed(0)}°C
                        </h6>
                      </div>
                      <div className="forecastBottom">
                        <p
                          className="gray-10"
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {forecast.wind.speed} m/s
                        </p>
                        <p className="gray-10">{forecast.main.humidity} %</p>
                        <p
                          className="gray-10"
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {precipitation.toFixed(0)} mm
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
