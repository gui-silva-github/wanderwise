export default function Place({ place, onSelectPlace }){
    console.log(place)
    return (
        <li key={place.id} className="place-item">
            <button onClick={() => onSelectPlace(place)}>
            <img src={`http://localhost:3000/${place.image.src}`} alt={place.image.alt} />
            <h3>{place.title}</h3>
            </button>
        </li>
    )
}