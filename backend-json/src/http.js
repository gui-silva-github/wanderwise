export async function fetchAvailablePlaces(){
    const response = await fetch('http://localhost:3000/places')
    const resData = await response.json()

    if (!response.ok){
        throw new Error('Falha ao carregar lugares!')
    }

    return resData.places
}

export async function fetchUserPlaces(){
    const response = await fetch('http://localhost:3000/user-places')
    const resData = await response.json()

    if (!response.ok){
        throw new Error('Falha ao carregar lugares de usuário!')
    }

    return resData.places
}

export async function updateUserPlaces(places){
    const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        body: JSON.stringify({ places }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const resData = await response.json()

    if (!response.ok){
        throw new Error('Falha ao atualizar lugares de usuário.')
    }

    return resData.message
}