import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import CurrentWeather from './CurrentWeather'

describe('<CurrentWeather />', () => {
  let territory = {
    name: 'Espoo',
    description: 'scattered clouds',
    date: new Date(1679402049 * 1000),
    icon: '10d',
    temp: '10.5',
    wind: 3.14,
    humidity: 85,
    precipitation: '2',
  }

  test('all values are present in component', () => {
    render(<CurrentWeather territory={territory} />)

    const name = screen.getByText('Espoo')
    expect(name).toBeDefined()

    const description = screen.getByText('scattered clouds')
    expect(description).toBeDefined()

    const date = screen.getByText('Mar 21st')
    expect(date).toBeDefined()

    const time = screen.getByText('14:34')
    expect(time).toBeDefined()

    const icon = screen.getByAltText('icon describing weather conditions')
    expect(icon).toBeDefined()

    const temp = screen.getByText('10.5°C')
    expect(temp).toBeDefined()

    const wind = screen.getByText('Wind: 3.14 m/s')
    expect(wind).toBeDefined()

    const humidity = screen.getByText('Humidity: 85 %')
    expect(humidity).toBeDefined()

    const precipitation = screen.getByText('Precipitation (3h): 2 mm')
    expect(precipitation).toBeDefined()
  })
})
