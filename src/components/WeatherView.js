import { useEffect, useState } from 'react'
import CurrentWeather from './CurrentWeather'
import DropMenu from './DropMenu'
import Forecast from './Forecast'
import Notification from './Notification'
import { fetchData } from '../utils/weatherService'

const WeatherView = () => {
  const [viewLocations, setViewLocations] = useState('Kaikki kaupungit')
  const [weatherData, setWeatherData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    fetchData(viewLocations, setWeatherData, setErrorMessage)
  }, [viewLocations])

  return (
    <main>
      <DropMenu
        viewLocations={viewLocations}
        setViewLocations={setViewLocations}
      />
      <Notification message={errorMessage} />

      {weatherData !== null &&
        (Object.keys(weatherData).length === 0 ? (
          <div>loading...</div>
        ) : (
          Object.keys(weatherData).map((objectKey) => {
            const territory = weatherData[objectKey]

            return (
              <div key={territory.name + territory.dt} className="territory">
                <CurrentWeather territory={territory} />
                <Forecast territory={territory} />
              </div>
            )
          })
        ))}
    </main>
  )
}

export default WeatherView
