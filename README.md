# Weather Radar

## How to get started

Open terminal.

Change the current working directory to the location where you want the cloned repository.

Clone the project using

```
git clone https://github.com/iisu36/weather-radar.git
```

Change the current working directory to the newly cloned repository and install all dependencies with

```
npm install
```

Create a file named `.env.local` at the root of the repository and in the file, write

```
REACT_APP_APIKEY=api-key-to-openweathermap
```

with `your-api-key-to-openweathermap` replaced with a api key to [openWeatherMap](https://openweathermap.org).

You are now ready to start the application with

```
npm start
```

## Testing

Tests are run with

```
CI=true npm test
```
