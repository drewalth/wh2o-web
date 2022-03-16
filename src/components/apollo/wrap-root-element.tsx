import React from 'react'
import { AppProvider } from '../provider/AppProvider'
import '../../../app.css'
import 'mapbox-gl/dist/mapbox-gl.css'

export const wrapRootElement = ({ element }) => <AppProvider>{element}</AppProvider>
