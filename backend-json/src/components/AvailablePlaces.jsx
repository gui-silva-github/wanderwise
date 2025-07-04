import { useState, useEffect } from "react"

import Places from "./Places"
import ErrorPage from "./ErrorPage"
import { sortPlacesByDistance } from "../loc"
import { fetchAvailablePlaces } from "../http"

export default function AvailablePlaces({ onSelectPlace }){

    const [isFetching, setIsFetching] = useState(false)
    const [availablePlaces, setAvailablePlaces] = useState([])
    const [error, setError] = useState()

    useEffect(() => {
        async function fetchPlaces(){
            setIsFetching(true)

            try{
                const places = await fetchAvailablePlaces()

                navigator.geolocation.getCurrentPosition((position) => {
                    const sortedPlaces = sortPlacesByDistance(
                        places,
                        position.coords.latitude,
                        position.coords.longitude
                    )
                    setAvailablePlaces(sortedPlaces)
                    setIsFetching(false)
                })
            } catch (error){
                setError({ message: error.message || 'Não foi possível buscar lugares, por favor, tente novamente!' })
            }
        }

        fetchPlaces()
    }, [])

    if (error){
        return <ErrorPage title="Ocorreu um erro." message={error.message} />
    }

    return (
        <Places
            title="Lugares disponíveis"
            places={availablePlaces}
            isLoading={isFetching}
            loadingText="Buscando dados dos lugares..."
            fallbackText="Não há lugares."
            onSelectPlace={onSelectPlace}
        />
    )

}