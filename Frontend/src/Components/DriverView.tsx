import { useEffect, useRef, useState } from 'react';
import styles from "./Layout.module.scss";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import {
	useJsApiLoader,
	GoogleMap,
	Marker,
	Autocomplete,
	DirectionsRenderer,
} from '@react-google-maps/api'
import {
	SkeletonText, StylesProvider,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { setDestinationRedux, setSourceRedux } from '../Redux/slices/mapSlice';
import { io } from 'socket.io-client'
import { log } from '@web3auth/base';
import ChatComponent from './ChatComponent';
import { useHuddle01 } from '@huddle01/react';
import { useAudio, useEventListener, useLobby, usePeers, useRoom, useVideo } from '@huddle01/react/hooks';
import { useAppUtils } from "@huddle01/react/app-utils";
import { Video, Audio } from '@huddle01/react/components'
import axios from 'axios';
import { Container } from 'react-bootstrap';
import Button from '../src/components/Button/Button';
import Sidebar from '../src/components/Sidebar/Sidebar';
const DriverView = () => {
	const riderInfo = useSelector(state => state)
	console.log("ri", riderInfo);

	//bengaluru latitude and longitude -  { lat: 12.840711, lng: 77.676369 }
	const [center, SetCenter] = useState({ lat: 12.840711, lng: 77.676369 })
	const [step, setStep] = useState(1)
	const count = useSelector((state: any) => state.counter);
	const { sourceRedux, destinationRedux } = useSelector((state: any) => state.map);
	const [renderComponent, setRenderComponent] = useState<any>(<></>)

	const APIKEY = "LhdzYNjP0w-YuvD2ko9hT_mX1mk2VA6y"
	const ProjectID = "6rdDYKc5_cm6w1t4H5C0wp_nOI84Z_8H"

	const { initialize, isInitialized, me } = useHuddle01();
	const [ROOMID, setROOMID] = useState("")
	const [inputroom, setinputroom] = useState("")
	const [anotherpeer, setanotherpeer] = useState("")

	const { joinLobby } = useLobby();
	const { joinRoom, leaveRoom } = useRoom();
	const { sendData } = useAppUtils()
	const peers = usePeers();
	const [riderpeerID, setriderpeerID] = useState<any>("")
	console.log("rider", riderpeerID);

	console.log("me", me);


	useEventListener("room:data-received", (data) => {
		console.log("rdaata", data);
	})
	useEventListener("room:joined", (data) => {
		console.log("roomjoined", data);
	})
	useEventListener("lobby:metadata", (data) => {
		joinRoom()
		console.log("rlobby", data);
	})

	useEffect(() => {
		// its preferable to use env vars to store projectId
		initialize(ProjectID);
	}, []);

	useEffect(() => {
		if (isInitialized) {
			console.log("initialized");

		}
	}, [isInitialized])

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: "AIzaSyD4k84CohF6qr_AMbtK_AKR7EpES6JueDE",
		libraries: ['places'],
	})

	const [chatOrMap, setChatOrMap] = useState(true)

	const [map, setMap] = useState<any>(null)
	const [directionsResponse, setDirectionsResponse] = useState(null)
	const [distance, setDistance] = useState('')
	const [duration, setDuration] = useState('')
	const [socket, setSocket] = useState<any>(null)

	/** @type React.MutableRefObject<HTMLInputElement> */
	const originRef = useRef<any>("")
	/** @type React.MutableRefObject<HTMLInputElement> */
	const destiantionRef = useRef<any>("")
	const dispatch = useDispatch();

	async function calculateRoute() {
		if (sourceRedux === '' || destinationRedux === '') {
			return
		}
		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService()
		const results: any = await directionsService.route({
			origin: sourceRedux,
			destination: destinationRedux,
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		})
		setDirectionsResponse(results)
		setDistance(results.routes[0].legs[0].distance.text)
		setDuration(results.routes[0].legs[0].duration.text)


	}

	const nextSource = async (data: any, datadest: any) => {
		// dispatch(setSourceRedux(data.current.value))
		// dispatch(setDestinationRedux(datadest.current.value))


		const directionsService = new google.maps.DirectionsService()
		const results: any = await directionsService.route({
			origin: center,
			destination: myData?.localSource,
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		})

		setDirectionsResponse(results)
		setDistance(results.routes[0].legs[0].distance.text)
		setDuration(results.routes[0].legs[0].duration.text)
		setStep(step + 1)
	}


	const setLiveLocation = async () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position: GeolocationPosition) => {
					const pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					console.log("current location", pos);
					SetCenter(pos)
				}
			);
		}
	}

	const reachedByDriver = async () => {
		console.log("hey", myData?.localSource,
			myData?.localDestination,);
		setTimeout(async () => {
			const directionsService = new google.maps.DirectionsService()
			const results: any = await directionsService.route({
				origin: myData?.localSource,
				destination: myData?.localDestination,
				travelMode: google.maps.TravelMode.DRIVING,
			})

			setDirectionsResponse(results)
			setDistance(results.routes[0].legs[0].distance.text)
			setDuration(results.routes[0].legs[0].duration.text)
			setStep(step + 1)
		}, 1000)

		socket?.emit('sendMessage', {
			type: "driverReachedToPick", myData
		});
	}

	useEffect(() => {
		setSocket(io('http://localhost:8080'))
	}, [])
	const [myData, setMyData] = useState<any>({})
	useEffect(() => {
		socket?.on('getMessage', (data: any) => {
			console.log(data);
			setriderpeerID(String(data.me?.meId).replace("peerId-",""))
			
			if (data.type == "requestDriver") {
				joinLobby(data.roomId)
				setROOMID(data.roomId)
				setMyData(data)
			}
		})
	}, [socket])

	useEffect(() => {
		if (step == 2) {

			if (myData) {
				setTimeout(() => {
					nextSource("", "")
				}, 1000)
			}

		}
	}, [myData])

	useEffect(() => {
		setLiveLocation()
	}, [])

	useEffect(() => {
		if (riderpeerID) {
			setTimeout(() => {
				console.log("show me ", riderpeerID);

				sendData([riderpeerID], { message: ["Hello I am leaving to pick you up"] })
			}, 2000)
		}
	}, [riderpeerID])

	console.log("step", step);
	console.log("rerendered");


	useEffect(() => {
		switch (step) {
			case 1: {
				setRenderComponent(
					<>
						<Button fluid onClick={() => { setStep(step + 1) }} >
							<i className="fa fa-car" /> Active
						</Button>
					</>
				)
			}
				break
			case 2: {
				setRenderComponent(
					<>
						<Button fluid disabled>
							Waiting
						</Button>
						<div className={styles.action}>
							<Button fluid onClick={() => { setStep(step - 1) }} >
								<i className="fa fa-arrow-left " aria-hidden="true"></i>
							</Button>
							<Button fluid onClick={() => { nextSource(originRef, destiantionRef) }} >
								<i className="fa fa-arrow-right" aria-hidden="true"></i>
							</Button>
						</div>
					</>
				)
			}
				break

			case 3: {
				setRenderComponent(
					<>
						<div className={styles.source_confirmation}>
							{/* <button onClick={()=>{ sendData([riderpeerID], { message: "Hello World" })}}>sss</button> */}
							<Button fluid className='mb-3' onClick={() => { setStep(step - 1) }} >
								<i className="fa fa-arrow-left" aria-hidden="true"></i>
							</Button>
							<div className={styles.source_confirmation_in}>
								<input
									type='text'
									placeholder='Destination'
									value={"Your Location"}
									disabled
									className={styles.input}
								/>
								<input
									type='text'
									placeholder='Destination'
									ref={destiantionRef}
									value={myData?.localSource}
									disabled
									className={styles.input}
								/>
								<input
									type='text'
									value={distance + ", " + duration}
									disabled
									className={styles.input}
								/>
							</div>
							<Button fluid className='mt-3' onClick={reachedByDriver} >
								Reached, pickup?
							</Button>
						</div>
						<div className={styles.action}>
							<Button fluid onClick={() => { setChatOrMap(true) }} >
								map
							</Button>
							<Button fluid onClick={() => { setChatOrMap(false) }} >
								chat
							</Button>
						</div>
					</>
				)
			}
				break
			case 4: {
				setRenderComponent(
					<>
						<div className={styles.reached_or_not}>
							<Button className="mb-3" fluid onClick={() => { setStep(step - 1) }} >
								<i className="fa fa-arrow-left" aria-hidden="true"></i>
							</Button>
							<div className={styles.reached_or_not_input}>
								<input
									type='text'
									placeholder='Destination'
									value={myData?.localSource}
									disabled
									className={styles.input}
								/>
								<input
									type='text'
									placeholder='Destination'
									ref={destiantionRef}
									value={myData?.localDestination}
									disabled
									className={styles.input}
								/>
								<input
									type='text'
									value={distance + ", " + duration}
									disabled
									className={styles.input}
								/>
							</div>
							<div className={styles.action}>
								<Button fluid onClick={reachedByDriver} >
									Reached Destination?
								</Button>
							</div>
						</div>
					</>
				)
			}
				break
			default:
		}

	}, [step])

	if (!isLoaded) {
		return <SkeletonText />
	}

	return (

		<>
			<main className={styles.layout}>
				<Sidebar/>
				<Container fluid>
					<div className={styles.layout_in}>
						<>
							{
								chatOrMap ?
									<GoogleMap
										center={center}
										zoom={15}
										mapContainerStyle={{ width: '100%', height: '90%' }}
										mapContainerClassName={styles.map}
										options={{
											zoomControl: true,
											streetViewControl: true,
											mapTypeControl: true,
											fullscreenControl: true,
										}}
										onLoad={(map: any) => setMap(map)}
									>
										<Marker position={center} />
										{directionsResponse && (
											<DirectionsRenderer directions={directionsResponse} />
										)}
									</GoogleMap>
									:
									<ChatComponent type="Driver" anotherpeer={riderpeerID} roomId={ROOMID} />
							}
						</>
						<footer className={styles.layout_footer}>
							{
								renderComponent
							}
						</footer>

					</div>
				</Container>
			</main>
		</>


	)
}

export default DriverView