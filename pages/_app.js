import React from 'react'
import '../styles/globals.css'
import theme from '../styles/theme'
import {ChakraProvider, CSSReset} from '@chakra-ui/react'
import {NavBar} from '../components'
import {RpgProvider, useRpgContext} from "../context/providers"

function MyApp({Component, pageProps}) {
  const { state = {}} = useRpgContext()

  if (Object.keys(state).length > 0){
    console.log('MyApp has rendered: ', JSON.stringify(state.character))
  }

  return (
    <RpgProvider>
      <ChakraProvider theme={theme}>
        <CSSReset/>
        <NavBar/>
        <Component {...pageProps} />
      </ChakraProvider>
    </RpgProvider>
  );
}

export default MyApp
