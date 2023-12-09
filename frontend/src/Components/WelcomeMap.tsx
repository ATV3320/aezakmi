import { useEffect, useRef, useState } from 'react';
import {
	useJsApiLoader,
	GoogleMap,
	Marker,
	Autocomplete,
	DirectionsRenderer,
} from '@react-google-maps/api'
import styles from "./Layout.module.scss";
import {
	SkeletonText,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { setDestinationRedux, setSourceRedux, setchatHistory } from '../Redux/slices/mapSlice';
import { io } from 'socket.io-client'
import "../App.scss"
import ChatComponent from './ChatComponent';

import { useHuddle01 } from '@huddle01/react';
import { useAudio, useEventListener, useLobby, usePeers, useRoom, useVideo } from '@huddle01/react/hooks';
import { useAppUtils } from "@huddle01/react/app-utils";
import { Video, Audio } from '@huddle01/react/components'
import axios from 'axios';
import { log } from '@web3auth/base';
import { Container } from 'react-bootstrap';
import Button from '../src/components/Button/Button';
import Sidebar from '../src/components/Sidebar/Sidebar';
import { callContractsMethods, callContractsMethodsRead, callMethods } from './main';
import { AscroAbi, AscroAddress } from '../Constants/Constants';

function WelcomeMap() {
	//bengaluru latitude and longitude
	const center = { lat: 12.840711, lng: 77.676369 }
	const [step, setStep] = useState(1)
	const count = useSelector((state: any) => state.counter);
	const { sourceRedux, destinationRedux } = useSelector((state: any) => state.map);
	const [renderComponent, setRenderComponent] = useState<any>(<></>)
	const riderInfo:{userKey:any,map:any} = useSelector((state:any) => state)
	console.log("ri", Object.keys(riderInfo));
    const [ridersPrivateKey,setridersPrivateKey]=useState<any>(localStorage.getItem("pkey"))
console.log("rpkey",ridersPrivateKey);

// useEffect(()=>{
// if(riderInfo)
// {
// 	console.log("riderInfo",riderInfo.userKey);
// 	if(riderInfo.userKey){
// 		setridersPrivateKey(riderInfo.userKey.data.privateKey)
// 	}
// }
// },[riderInfo])
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: "AIzaSyD4k84CohF6qr_AMbtK_AKR7EpES6JueDE",
		libraries: ['places'],
	})


	const APIKEY = "LhdzYNjP0w-YuvD2ko9hT_mX1mk2VA6y"
	const ProjectID = "6rdDYKc5_cm6w1t4H5C0wp_nOI84Z_8H"

	const { initialize, isInitialized, me } = useHuddle01();
	const [ROOMID, setROOMID] = useState("")
	const [inputroom, setinputroom] = useState("")
	const [anotherpeer, setanotherpeer] = useState("")
	const dispatch = useDispatch();

	const { joinLobby } = useLobby();
	const { joinRoom, leaveRoom } = useRoom();
	const { sendData } = useAppUtils()
	const peers = usePeers();
	const chatss: any = useSelector((state: any) => state?.map?.chatHistory)


	useEventListener("room:data-received", (data: any) => {
		console.log("rdaata", data);
		setanotherpeer(String(data?.fromPeerId).replace("peerId-", ""))

	})
	useEventListener("room:joined", (data) => {
		console.log("roomjoined", data);
	})
	useEventListener("lobby:metadata", (data) => {
		joinRoom()
		console.log("rlobby", data);
	})

	const jointhelobby = () => {
		joinLobby(ROOMID)
	}
	console.log("me", me);

	console.log("roomid", ROOMID);
	console.log(inputroom);

useEffect(()=>{
	initialize(ProjectID);
},[])

	useEffect(() => {
		// its preferable to use env vars to store projectId
if(ridersPrivateKey)
		callContractsMethods(ridersPrivateKey, AscroAddress, AscroAbi, "currentRideId", [])

	}, [ridersPrivateKey]);

	useEffect(() => {
		if (isInitialized) {
			clickme()
		}
	}, [isInitialized])

	useEffect(() => {
		if (ROOMID != "") {
			jointhelobby()
		}
	}, [ROOMID])

	const clickme = async () => {
		const response = await axios.post(
			'https://api.huddle01.com/api/v1/create-room',
			{
				title: 'Huddle01-Test',
				hostWallets: ['0x29f54719E88332e70550cf8737293436E9d7b10b'],
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': APIKEY,
				},
			}
		).then((res) => {
			setROOMID(res.data.data.roomId)
		}).catch((err) => {
			console.log("err", err);
		})
	}



	const [map, setMap] = useState(null)
	const [directionsResponse, setDirectionsResponse] = useState(null)
	const [distance, setDistance] = useState('')
	const [duration, setDuration] = useState('')
	const [socket, setSocket] = useState<any>(null)

	/** @type React.MutableRefObject<HTMLInputElement> */
	const originRef = useRef<any>()
	/** @type React.MutableRefObject<HTMLInputElement> */
	const destiantionRef = useRef<any>()

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
		console.log("cll");


	}
	const [localSource, setLocalSource] = useState<any>("")
	const [localDestination, setLocalDestination] = useState<any>("")
	const [chatOrMap, setChatOrMap] = useState(true)
	const [distanceMeters, setDistanceMeters] = useState("")
	const [durationseconds, setdurationseconds] = useState("")

	const nextSource = async (data: any, datadest: any) => {
		dispatch(setSourceRedux(data.current.value))
		dispatch(setDestinationRedux(datadest.current.value))
		setLocalSource(data.current.value)
		setLocalDestination(datadest.current.value)

		const directionsService = new google.maps.DirectionsService()
		const results: any = await directionsService.route({
			origin: data.current.value,
			destination: datadest.current.value,
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		})
		setDirectionsResponse(results)
		setDistance(results.routes[0].legs[0].distance.text)
		setDuration(results.routes[0].legs[0].duration.text)
		setStep(step + 1)
		console.log("dist", results.routes[0].legs[0].duration.value, results.routes[0].legs[0].distance.value);
		setDistanceMeters(results.routes[0].legs[0].distance.value)
		setdurationseconds(results.routes[0].legs[0].duration.value)
	}

	const nextSourceJustName = async (data: any, datadest: any) => {
		setStep(step + 1)

		setTimeout(async () => {
			const directionsService = new google.maps.DirectionsService()
			const results: any = await directionsService.route({
				origin: data,
				destination: datadest,
				// eslint-disable-next-line no-undef
				travelMode: google.maps.TravelMode.DRIVING,
			})
			setDirectionsResponse(results)
			setDistance(results.routes[0].legs[0].distance.text)
			setDuration(results.routes[0].legs[0].duration.text)
		}, 4000);

	}

	const askForRide = () => {
		console.log("clci");

		socket?.emit('sendMessage', {
			type: "requestDriver",
			localSource,
			localDestination,
			roomId: ROOMID,
			me: me, rideCount: rideCount
		});
		if (rideCount)
			callContractsMethods(ridersPrivateKey, AscroAddress, AscroAbi, "bookRide", [distanceMeters, durationseconds, 1])
		else
			console.log("ride count not initialize");

		nextSourceJustName(localSource, localDestination)
	}

	const [rideCount, setRideCount] = useState(0)
	console.log("ridecount", rideCount);

	const callcount = async () => {
		const result: any = await callContractsMethodsRead(ridersPrivateKey, AscroAddress, AscroAbi, "currentRideId", [])
		if (result) {
			setRideCount(Number(result))
		}
	}

	useEffect(() => {
		callcount()
		setSocket(io('http://localhost:8080'))
	}, [])


	useEffect(() => {

	}, [step])

	useEffect(() => {
		socket?.on('getMessage', async (data: any) => {
			console.log(data);

			if (data.type == "driverReachedToPick") {
				console.log("driverReachedToPick");
				console.log(data?.myData.localSource, "----", data?.myData.localDestination);
				console.log("ride ji",data);
				
				callContractsMethods(ridersPrivateKey, AscroAddress, AscroAbi, "bothMet", [data.rcount, true])

				setStep(5)
			

				setTimeout(async () => {
					const directionsService = new google.maps.DirectionsService()
					const results: any = await directionsService.route({
						origin: data?.myData.localSource,
						destination: data?.myData.localDestination,
						// eslint-disable-next-line no-undef
						travelMode: google.maps.TravelMode.DRIVING,
					})
					setDirectionsResponse(results)
					setDistance(results.routes[0].legs[0].distance.text)
					setDuration(results.routes[0].legs[0].duration.text)
				}, 4000);




			}
		})
	}, [socket])
	console.log("step", step);

	useEffect(() => {
		switch (step) {
			case 1: {
				setRenderComponent(
					<>
						<Button fluid onClick={() => { setStep(step + 1) }} >
							<i className="fa fa-car" /> Book a Ride
						</Button>
					</>
				)
			}
				break
			case 2: {
				setRenderComponent(
					<>
						<div className={styles.select_source}>
							<div className={styles.select_source_input}>
								<Autocomplete>
									<input
										type='text'
										placeholder='Source'
										ref={originRef}
										className={styles.input}
									/>
								</Autocomplete>
								<Autocomplete>
									<input
										type='text'
										placeholder='Destination'
										ref={destiantionRef}
										className={styles.input}
									/>
								</Autocomplete>
							</div>
							<div className={styles.action}>
								<Button variant="bordered_blue" fluid onClick={() => { setStep(step - 1) }} >
									<i className="fa fa-arrow-left " aria-hidden="true"></i>
								</Button>
								<Button fluid onClick={() => { nextSource(originRef, destiantionRef) }} >
									<i className="fa fa-arrow-right" aria-hidden="true"></i>
								</Button>
							</div>
						</div>
					</>
				)
			}
				break

			case 3: {
				setRenderComponent(
					<>
						<div className={styles.source_confirmation}>
							<div className={styles.source_confirmation_in}>
								<input
									type='text'
									placeholder='Destination'
									value={sourceRedux}
									disabled
									className={styles.input}
								/>
								<input
									type='text'
									placeholder='Destination'
									ref={destiantionRef}
									value={destinationRedux}
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
								<Button variant='bordered_blue' fluid onClick={() => { setStep(step - 1) }} >
									<i className="fa fa-arrow-left" aria-hidden="true"></i>
								</Button>
								<Button fluid onClick={() => { nextSourceJustName(localSource, localDestination) }} >
									<i className="fa fa-arrow-right" aria-hidden="true"></i>
								</Button>
							</div>
							<Button fluid className="mt-3" onClick={askForRide} >
								confirm
							</Button>
						</div>
					</>
				)
			}
				break
			case 4:
				{
					setRenderComponent(
						<>
							<div className={styles.driver_reached}>
								<Button fluid className='mb-3' onClick={() => { setStep(step - 1) }} >
									<i className="fa fa-arrow-left" aria-hidden="true"></i>
								</Button>
								<div className={styles.driver_reached_in}>
									<input
										type='text'
										placeholder='Destination'
										ref={destiantionRef}
										value={"Driver is on the way...!"}
										disabled
										className={styles.input}
									/>
									<input
										type='text'
										placeholder='Destination'
										ref={destiantionRef}
										value={"Driver reached?"}
										disabled
										className={styles.input}
									/>
								</div>
								<div className={styles.action}>
									<Button active={!chatOrMap} fluid onClick={() => { setChatOrMap(true) }} >
										map
									</Button>
									<Button active={chatOrMap} fluid onClick={() => { setChatOrMap(false) }} >
										chat
									</Button>
								</div>
							</div>
						</>
					)
				}
				break
			case 5:
				{
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
										value={sourceRedux}
										disabled
										className={styles.input}
									/>
									<input
										type='text'
										placeholder='Destination'
										ref={destiantionRef}
										value={destinationRedux}
										disabled
										className={styles.input}
									/>
									<input
										type='text'
										value={distance + ", " + duration}
										className={styles.input}
										disabled
									/>
								</div>
								<div className={styles.action}>
									<Button fluid>
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
				<Sidebar />
				<Container fluid>
					<div className={styles.layout_in}>
						<>
							{
								chatOrMap ?
									<GoogleMap
										center={center}
										zoom={15}
										mapContainerStyle={{ width: '100%', height: '90%' }}
										options={{
											zoomControl: false,
											streetViewControl: false,
											mapTypeControl: false,
											fullscreenControl: false,
										}}
										mapContainerClassName={styles.map}
										onLoad={(map: any) => setMap(map)}
									>
										<Marker position={center} />
										{directionsResponse && (
											<DirectionsRenderer directions={directionsResponse} />
										)}
									</GoogleMap>
									:
									<ChatComponent type="Rider" anotherpeer={anotherpeer} roomId={ROOMID} />
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
	);
}

export default WelcomeMap;
