import axios from 'axios'

const APIkey = process.env.REACT_APP_APIKEY

const CITIES = {
  660129: { name: 'Espoo', lat: 60.25, lon: 24.6667 },
  634963: { name: 'Tampere', lat: 61.4991, lon: 23.7871 },
  655194: { name: 'Jyväskylä', lat: 62.2415, lon: 25.7209 },
  650224: { name: 'Kuopio', lat: 62.8924, lon: 27.677 },
}

const get3hPrecipitation = (object) => {
  if (object.rain) {
    return object.rain['3h'].toFixed()
  } else if (object.snow) {
    return object.snow['3h'].toFixed()
  } else {
    return '0' // toFixed() returns string so all possibilities are strings
  }
}

const getPromises = (viewLocations) => {
  const weatherPromises = []
  const forecastPromises = []
  let locations = []
  if (viewLocations === 'Kaikki kaupungit') {
    locations = CITIES
  } else {
    const key = Object.keys(CITIES).find(
      (id) => CITIES[id].name === viewLocations
    )
    locations = { city: CITIES[key] }
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

  return { weatherPromises, forecastPromises }
}

const getCurrentWeatherData = async (weatherPromises, setErrorMessage) => {
  const weatherResponse = await Promise.all(weatherPromises)
  const currentWeather = {}
  weatherResponse.forEach((index) => {
    const object = index.data
    // City name with äö, because in the API e.g. Jyväskylä = Jyvaskyla
    const name = CITIES[object.id].name
    const temp = (object.main.temp - 273.15).toFixed(1).replace('-0.0', '0.0')
    const date = new Date(object.dt * 1000)
    currentWeather[name] = {
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
  return currentWeather
}

const addForecastWeatherData = async (
  forecastPromises,
  currentWeatherObject,
  setErrorMessage
) => {
  const joinedWeatherObject = {}

  const forecastResponse = await Promise.all(forecastPromises)
  forecastResponse.forEach((index) => {
    const object = index.data
    // City name with äö, because in the API e.g. Jyväskylä = Jyvaskyla
    const name = CITIES[object.city.id].name
    // Making sure the forecast is later than current weather
    const startIndex = object.list.findIndex(
      (index) => currentWeatherObject[name].dt < index.dt
    )
    const forecasts = object.list.slice(startIndex, startIndex + 5)

    const forecastObjectArray = []

    for (let forecast of forecasts) {
      const date = new Date(forecast.dt * 1000)
      const temp = (forecast.main.temp - 273.15).toFixed().replace('-0', '0')
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
      forecastObjectArray.push(forecastObject)
    }

    joinedWeatherObject[name] = {
      ...currentWeatherObject[name],
      precipitation: forecastObjectArray[0].precipitation,
      forecasts: forecastObjectArray,
    }
  })
  return joinedWeatherObject
}

export const fetchData = async (
  viewLocations,
  setWeatherData,
  setErrorMessage
) => {
  const { weatherPromises, forecastPromises } = getPromises(viewLocations)
  let currentWeatherObject = {}
  try {
    currentWeatherObject = await getCurrentWeatherData(
      weatherPromises,
      setErrorMessage
    )
  } catch (error) {
    setErrorMessage(
      'Something went wrong fetching current weather data: ' + error.message
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    setWeatherData(null)
    return
  }
  try {
    const joinedWeatherObject = await addForecastWeatherData(
      forecastPromises,
      currentWeatherObject,
      setErrorMessage
    )
    setWeatherData(joinedWeatherObject)
  } catch (error) {
    setErrorMessage(
      'Something went wrong fetching forecast data: ' + error.message
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    setWeatherData(null)
  }
}
