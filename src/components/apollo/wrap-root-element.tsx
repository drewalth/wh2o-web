import React from 'react'
import {AppProvider} from "../provider/AppProvider"

export const wrapRootElement = ({element}) => (<AppProvider>{element}</AppProvider>)
