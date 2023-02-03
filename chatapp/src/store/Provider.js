import { useReducer, useState } from "react"
import Contex from "./Context"
import Reducer, { initState } from "./Reducer"


const Provider = ({ children}) =>{
    const [state, depatch] = useReducer(Reducer, initState)
  

    return (
        <Contex.Provider value={{state, depatch}}>
            {children}
        </Contex.Provider>
    )
}

export default Provider