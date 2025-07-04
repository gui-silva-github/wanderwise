import { useRef, useState, useCallback, useEffect } from "react"

import Places from "./components/Places.jsx"
import Modal from "./components/Modal.jsx"
import DeleteConfirmation from "./components/DeleteConfirmation.jsx"
import logoImg from "./assets/logo.png"
import AvailablePlaces from "./components/AvailablePlaces.jsx"
import { fetchUserPlaces, updateUserPlaces } from "./http.js"
import ErrorPage from "./components/ErrorPage.jsx"

function App(){
  const selectedPlace = useRef()

  const [userPlaces, setUserPlaces] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState()

  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState()

  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {
    async function fetchPlaces(){
      setIsFetching(true)

      try{
        const places = await fetchUserPlaces()

        setUserPlaces(places)
      } catch (error){
        setError({ message: error.message || 'Falha ao carregar lugares de usuário.' })
      }

      setIsFetching(false)
    }

    fetchPlaces()
  }, [])

  function handleStartRemovePlace(place){
    setModalIsOpen(true)
    selectedPlace.current = place
  }

  function handleStopRemovePlace(){
    setModalIsOpen(false)
  }

  async function handleSelectPlace(selectedPlace){
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces){
        prevPickedPlaces = []
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)){
        return prevPickedPlaces
      }
      return [selectedPlace, ...prevPickedPlaces]
    })

    try{
      await updateUserPlaces([selectedPlace, ...userPlaces])
    } catch(error) {
      setUserPlaces(userPlaces)
      setErrorUpdatingPlaces({ message: error.message || 'Falha ao atualizar lugares de usuário!' })
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace(){
    setUserPlaces((prevPickedPlaces) => 
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    )

    try{
      await updateUserPlaces(userPlaces.filter((place) => place.id !== selectedPlace.current.id))
    } catch (error){
      setUserPlaces(userPlaces)
      setErrorUpdatingPlaces({ message: error.message || 'Falha ao deletar lugares!' })
    }

    setModalIsOpen(false)
  }, [userPlaces])

  function handleError(){
    setErrorUpdatingPlaces(null)
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
         {errorUpdatingPlaces && (
          <ErrorPage 
            title="Ocorreu um erro."
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
         )} 
      </Modal>

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
        {error && <ErrorPage title="Ocorreu um erro." message={error.message} />}

        {!error && (
          <Places
            title="Eu gostaria de visitar..."
            fallbackText="Selecione os lugares que você gostaria de visitar abaixo."
            isLoading={isFetching}
            loadingText="Buscando seus lugares..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  )

}

export default App