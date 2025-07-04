import Place from "./Place";

export default function Places({ title, places, fallbackText, onSelectPlace }){
    
    return (
        <section className="places-category">
            <h2>{title}</h2>
            {places.length === 0 && <p className="fallback-text">{fallbackText}</p>}
            {places.length > 0 && (
                <ul className="places">
                    {places.map((place) => (
                        <Place key={place.id} {...place} onSelectPlace={onSelectPlace} />
                    ))}
                </ul>
            )}
        </section>
    )

}