import { writable } from "svelte/store"


const fetchAgents = async () => {
    const url = 'https://valorant-api.com/v1/agents'
    const res = await fetch(url)
    const data = await res.json()

    for (const [key, value] of Object.entries(data)) {
        fetchAgents.set(value)
    }
}

fetchAgents()