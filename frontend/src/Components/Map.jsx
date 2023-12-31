import React from 'react'
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
  } from '@chakra-ui/react'
  import { FaLocationArrow, FaTimes } from 'react-icons/fa'
  
  import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
  } from '@react-google-maps/api'
  import { useRef, useState } from 'react'
  //bengaluru latitude and longitude
  const center = { lat: 12.840711, lng: 77.676369 }
  

const Map = () => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "<your-Google-Map API keys>",
        libraries: ['places'],
      })
    
    
      const [map, setMap] =useState(null)
      const [directionsResponse, setDirectionsResponse] = useState(null)
      const [distance, setDistance] = useState('')
      const [duration, setDuration] = useState('')
    console.log(distance,duration);
      /** @type React.MutableRefObject<HTMLInputElement> */
      const originRef = useRef()
      /** @type React.MutableRefObject<HTMLInputElement> */
      const destiantionRef = useRef()
    
      if (!isLoaded) {
        return <SkeletonText />
      }
    
      async function calculateRoute() {
        if (originRef.current.value === '' || destiantionRef.current.value === '') {
          return
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
      }
    
      function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destiantionRef.current.value = ''
      }
    

      return (
        <Flex
          position='relative'
          flexDirection='column'
          alignItems='center'
          h='100vh'
          w='100vw'
        >
          <Box position='absolute'  left={0} top={0} h='85%' w='100%'>
            {/* Google Map Box */}
            <GoogleMap
              center={center}
              zoom={15}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={(map) => setMap(map)}
            >
              <Marker position={center} />
              {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
              )}
            </GoogleMap>



            <Box
           
            borderRadius='lg'
         
            bgColor='yellow'
            shadow='base'
            minW='container.md'
            zIndex='1'
          >
            <HStack spacing={2} justifyContent='start'>
              <Box flexGrow={1}>
              <Autocomplete>
               
                  <input style={{
                    border: 0,
                  
                
                    width: '100%',
                    position: "relative",
                    borderRadius: 3,
                   padding: 9 ,
                  
               
                    fontSize: 16,
                    fontWeight: 400,
                    height: 40,
                  
                    
                }}  type='text' placeholder='Origin' ref={originRef} />
                </Autocomplete>
                
              </Box>
              <Box flexGrow={1}>
                <Autocomplete>
                  <Input
                    type='text'
                    placeholder='Destination'
                    ref={destiantionRef}
                  />
                </Autocomplete>
              </Box>
    
              <ButtonGroup>
                <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
                  Calculate Route
                </Button>
                <IconButton
                  aria-label='center back'
                  icon={<FaTimes />}
                  onClick={clearRoute}
                />
              </ButtonGroup>
            </HStack>
            <HStack spacing={4} mt={4} justifyContent='space-between'>
              <Text>Distance: {distance} </Text>
              <Text>Duration: {duration} </Text>
              <IconButton
                aria-label='center back'
                icon={<FaLocationArrow />}
                isRound
                onClick={() => {
                  map.panTo(center)
                  map.setZoom(15)
                }}
              />
            </HStack>
          </Box>
          </Box>
         
        </Flex>
      )
}


  
  export default Map