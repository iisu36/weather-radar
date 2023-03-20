import { useEffect, useState } from 'react'
import CurrentWeather from './CurrentWeather'
import DropMenu from './DropMenu'
import Forecast from './Forecast'
import { fetchData } from '../utils/weatherService'

const WeatherView = () => {
  const [viewLocations, setViewLocations] = useState('Kaikki kaupungit')
  const [weatherData, setWeatherData] = useState({})

  useEffect(() => {
    fetchData(viewLocations, setWeatherData)
  }, [viewLocations])

  return (
    <main>
      <DropMenu
        viewLocations={viewLocations}
        setViewLocations={setViewLocations}
      />

      {Object.keys(weatherData).length === 0 ? (
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
      )}
    </main>
  )
}

export default WeatherView
