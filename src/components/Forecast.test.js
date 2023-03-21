import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Forecast from './Forecast'

describe('<Forecast />', () => {
  let territory = {
    name: 'Espoo',
    forecasts: [
      {
        date: new Date(1679410800 * 1000),
        dt: 1679410800,
        humidity: 85,
        icon: '04d',
        precipitation: '2',
        temp: '1',
        wind: 3.18,
      },
      {
        date: new Date(1679454000 * 1000),
        dt: 1679454000,
        humidity: 98,
        icon: '13n',
        precipitation: '0',
        temp: '-1',
        wind: 2.37,
      },
    ],
  }

  test('all values are present in component', () => {
    render(<Forecast territory={territory} />)

    const time = screen.getByText('17:00')
    expect(time).toBeDefined()
    const time2 = screen.getByText('05:00')
    expect(time2).toBeDefined()

    const icon = screen.getAllByAltText('icon describing weather conditions')
    expect(icon).toBeDefined()

    const temp = screen.getByText('1°C')
    expect(temp).toBeDefined()
    const temp2 = screen.getByText('-1°C')
    expect(temp2).toBeDefined()

    const wind = screen.getByText('3.18 m/s')
    expect(wind).toBeDefined()
    const wind2 = screen.getByText('2.37 m/s')
    expect(wind2).toBeDefined()

    const humidity = screen.getByText('85 %')
    expect(humidity).toBeDefined()
    const humidity2 = screen.getByText('98 %')
    expect(humidity2).toBeDefined()

    const precipitation = screen.getByText('2 mm')
    expect(precipitation).toBeDefined()
    const precipitation2 = screen.getByText('0 mm')
    expect(precipitation2).toBeDefined()
  })
})
