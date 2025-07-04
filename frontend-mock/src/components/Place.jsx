export default function Place({ id, onSelectPlace, image, title }){

    return (
        <li key={id} className="place-item">
            <button onClick={() => onSelectPlace(id)}>
                <img src={image.src} alt={image.alt} />
                <h3>{title}</h3>
            </button>
        </li>
    )

}