const options = ['Kaikki kaupungit', 'Espoo', 'Tampere', 'Jyväskylä', 'Kuopio']

const DropMenu = ({ viewLocations, setViewLocations }) => {
  return (
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
              className="black size13"
            >
              {option}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default DropMenu
