import { useRef, useState, useEffect, useCallback } from "react"

import Places from "./components/Places.jsx"
import AVAILABLE_PLACES from "./mock/data.js"
import Modal from "./components/Modal.jsx"
import DeleteConfirmation from "./components/DeleteConfirmation.jsx"
import logoImg from "./assets/logo.png"
import { sortPlacesByDistance } from "./loc.js"

const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || []
const storedPlaces = storedIds.map((id) => 
  AVAILABLE_PLACES.find((place) => place.id === id)
)

function App() {
  
  const selectedPlace = useRef()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      )

      setAvailablePlaces(sortedPlaces)
    })
  }, [])

  function handleStartRemovePlace(id){
    setModalIsOpen(true)
    selectedPlace.current = id
  }

  function handleStopRemovePlace(){
    setModalIsOpen(false)
  }

  function handleSelectPlace(id){
    setPickedPlaces((prevPickedPlaces) => {
      if (pickedPlaces.some((place) => place.id === id)){
        return prevPickedPlaces
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id)
      return [place, ...pickedPlaces]
    })

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || []
    if (storedIds.indexOf(id) === -1){
      localStorage.setItem(
        'selectedPlaces',
        JSON.stringify([id, ...storedIds])
      )
    }
  }

  const handleRemovePlace = useCallback(
    function handleRemovePlace(){
      setPickedPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
      )
      setModalIsOpen(false)

      const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || []
      localStorage.setItem(
        'selectedPlaces',
        JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
      )
    }
  , [])

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="logo" />
        <h1>WanderWise</h1>
        <p>
          Crie sua coleção pessoal de lugares que você gostaria de visitar ou já visitou.
        </p>
      </header>
      <main>
        <Places
          title="Eu gostaria de visitar..."
          fallbackText={"Selecione os lugares que você já visitou abaixo."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <Places
          title="Lugares famosos"
          places={availablePlaces}
          fallbackText="Ordenando lugares por distância"
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  )
}

export default App
