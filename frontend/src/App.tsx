import { useEffect, useState } from "react";
import car from "./src/assets/taxi-img.png";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
	WALLET_ADAPTERS,
	CHAIN_NAMESPACES,
	IProvider,
	log,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import "./App.scss";
// import RPC from './ethersRPC' // for using ethers.js
import RPC from "./web3RPC"; // for using web3.js
import { setUserKeyData } from "./Redux/slices/UserKey";
import { useDispatch, useSelector } from "react-redux";
import wall1 from "./wall.png"
import wall2 from "./wall1.webp"
import { Link } from "react-router-dom";
import { getSmartContractWalletAddress } from "./Components/main";
import { Container } from "react-bootstrap";
import Button from "./src/components/Button/Button";
const { ethers } = require('ethers');

const clientId =
	"BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

function App() {
	const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
	const [provider, setProvider] = useState<IProvider | null>(null);
	const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
	const [PrivateKey, setPrivateKey] = useState<any>("")
	const [fundAddress, setFundAddress] = useState<any>("")

	useEffect(() => {
		const init = async () => {
			try {
				const chainConfig = {
					chainNamespace: CHAIN_NAMESPACES.EIP155,
					chainId: "0x5", // Please use 0x1 for Mainnet
					rpcTarget: "https://rpc.ankr.com/eth_goerli",
					displayName: "Goerli Testnet",
					blockExplorer: "https://goerli.etherscan.io/",
					ticker: "ETH",
					tickerName: "Ethereum",
				};

				const web3auth = new Web3AuthNoModal({
					clientId,
					chainConfig,
					web3AuthNetwork: "cyan",
					useCoreKitKey: false,
				});

				const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

				const openloginAdapter = new OpenloginAdapter({
					privateKeyProvider,
					adapterSettings: {
						uxMode: "redirect",
						loginConfig: {
							jwt: {
								verifier: "web3auth-auth0-demo",
								typeOfLogin: "jwt",
								clientId: "294QRkchfq2YaXUbPri7D6PH7xzHgQMT",
							},
						},
					},
				});
				web3auth.configureAdapter(openloginAdapter);
				setWeb3auth(web3auth);

				await web3auth.init();
				setProvider(web3auth.provider);

				if (web3auth.connected) {
					setLoggedIn(true);
				}
			} catch (error) {
				console.error(error);
			}
		};

		init();
	}, []);
	const [userKey, setUserKey] = useState({})
	console.log(userKey);
	const dispatch = useDispatch();
	const count = useSelector((state: any) => state);
	console.log("count", count);


	useEffect(() => {
		if (loggedIn) {
			getUserInfo()
			authenticateUser()
			getChainId()
			getAccounts()
			getBalance()
			signMessage()
			sendTransaction()
			getPrivateKey()
		}
	}, [loggedIn])


	useEffect(() => {
		if (userKey) {
			setTimeout(() => {
				dispatch(setUserKeyData(userKey))
			}, 4000)

		}
	}, [userKey])

	useEffect(() => {
		if (PrivateKey) {
			getSmartContractWalletAddress(PrivateKey).then((res:any) => setFundAddress(res))
		}
	}, [PrivateKey])

	const login = async () => {
		if (!web3auth) {
			uiConsole("web3auth not initialized yet");
			return;
		}
		const web3authProvider = await web3auth.connectTo(
			WALLET_ADAPTERS.OPENLOGIN,
			{
				loginProvider: "jwt",
				extraLoginOptions: {
					domain: "https://shahbaz-torus.us.auth0.com",
					verifierIdField: "sub",
					// connection: "google-oauth2", // Use this to skip Auth0 Modal for Google login.
				},
			}
		);
		setProvider(web3authProvider);
	};

	const authenticateUser = async () => {
		if (!web3auth) {
			uiConsole("web3auth not initialized yet");
			return;
		}
		const idToken = await web3auth.authenticateUser();
		const tempUserKey: any = userKey
		tempUserKey["idToken"] = idToken
		setUserKey(tempUserKey)
		uiConsole(idToken);
	};

	const getUserInfo = async () => {
		if (!web3auth) {
			uiConsole("web3auth not initialized yet");
			return;
		}
		const user = await web3auth.getUserInfo();
		const tempUserKey: any = userKey
		tempUserKey["user"] = user
		setUserKey(tempUserKey)
		uiConsole(user);
	};

	const logout = async () => {
		if (!web3auth) {
			uiConsole("web3auth not initialized yet");
			return;
		}
		await web3auth.logout();
		setLoggedIn(false);
		setProvider(null);
	};

	const getChainId = async () => {
		if (!provider) {
			uiConsole("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const chainId = await rpc.getChainId();
		const tempUserKey: any = userKey
		tempUserKey["chainId"] = chainId
		setUserKey(tempUserKey)
		uiConsole(chainId);
	};
	const getAccounts = async () => {
		if (!provider) {
			uiConsole("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const address = await rpc.getAccounts();
		const tempUserKey: any = userKey
		tempUserKey["address"] = address
		setUserKey(tempUserKey)
		uiConsole(address);
	};

	const getBalance = async () => {
		if (!provider) {
			uiConsole("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const balance = await rpc.getBalance();
		const tempUserKey: any = userKey
		tempUserKey["balance"] = balance
		setUserKey(tempUserKey)
		uiConsole(balance);
	};

	const sendTransaction = async () => {
		if (!provider) {
			uiConsole("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const receipt = await rpc.sendTransaction();
		const tempUserKey: any = userKey
		tempUserKey["receipt"] = receipt
		setUserKey(tempUserKey)
		uiConsole(receipt);
	};

	const signMessage = async () => {
		if (!provider) {
			uiConsole("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const signedMessage = await rpc.signMessage();
		const tempUserKey: any = userKey
		tempUserKey["signedMessage"] = signedMessage
		setUserKey(tempUserKey)
		uiConsole(signedMessage);
	};

	function uiConsole(...args: any[]): void {
		const el = document.querySelector("#console>p");
		if (el) {
			el.innerHTML = JSON.stringify(args || {}, null, 2);
		}
	}
	console.log("pri", PrivateKey);

	const getPrivateKey = async () => {
		if (!provider) {
			uiConsole("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const privateKey = await rpc.getPrivateKey();
		const tempUserKey: any = userKey
		tempUserKey["privateKey"] = privateKey
		setPrivateKey(privateKey)
		setUserKey(tempUserKey)
		uiConsole(privateKey);
	};

	const transferToFund = () => {
		const privateKeySender = '0xe607b39dde4075839a179d719ad0b89e7654825e4c00de10b9017d089b285d04';
		const privateKeyReceiver = fundAddress;
		const mumbaiRpcUrl = 'https://polygon-mumbai.infura.io/v3/f30ddaad312549deb43cf77f6bbf91bf'; // Polygon Mumbai testnet RPC endpoint

		(async () => {
			const provider = new ethers.JsonRpcProvider(mumbaiRpcUrl);
			const signer = new ethers.Wallet(privateKeySender, provider);

			const tx = await signer.sendTransaction({
				to: fundAddress,
				value: ethers.parseUnits('0.001', 'ether'),
			});
			alert("fund deposition done")
		})();
	}

	const loggedInView = (
		<>
			<div className="flex-container">
				<div>
					<button onClick={getUserInfo} className="card">
						Get User Info
					</button>
				</div>
				<div>
					<button onClick={authenticateUser} className="card">
						Get ID Token
					</button>
				</div>
				<div>
					<button onClick={getChainId} className="card">
						Get Chain ID
					</button>
				</div>
				<div>
					<button onClick={getAccounts} className="card">
						Get Accounts
					</button>
				</div>
				<div>
					<button onClick={getBalance} className="card">
						Get Balance
					</button>
				</div>
				<div>
					<button onClick={signMessage} className="card">
						Sign Message
					</button>
				</div>
				<div>
					<button onClick={sendTransaction} className="card">
						Send Transaction
					</button>
				</div>
				<div>
					<button onClick={getPrivateKey} className="card">
						Get Private Key
					</button>
				</div>
				<div>
					<button onClick={logout} className="card">
						Log Out
					</button>
				</div>
			</div>
			<div id="console" style={{ whiteSpace: "pre-line" }}>
				<p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
			</div>
		</>
	);

	// const unloggedInView = (
	// 	<button onClick={login} className="card">
	// 		Login
	// 	</button>
	// );
	function manipulateString(inputString: string) {
		// Ensure the input has more than 5 characters
		if (inputString.length <= 5) {
			return inputString; // Return the original string if it has 5 or fewer characters
		}

		// Take the first 5 characters
		const firstFiveChars = inputString.slice(0, 5);

		// Take the last 5 characters
		const lastFiveChars = inputString.slice(-5);

		// Add 3 dots in between
		const resultString = `${firstFiveChars}...${lastFiveChars}`;

		return resultString;
	}
	return (
		<div className="home_page">
			<Container fluid>
				<div className="home_page_in">
					<img src={car} alt="car" />
					{
						loggedIn ?
							<>
								<h2>Welcome You Are Logged IN !</h2>
								<Link to="/ride" className="mt-auto">
									<Button fluid>
										Lets Ride
									</Button>
								</Link>
								<Button fluid className="mt-3" variant="bordered_blue" onClick={logout}>
									Log Out
								</Button>
								{
									fundAddress ?
										<Button fluid className="mt-3" variant="bordered_blue" title={fundAddress} onClick={transferToFund}>
											Fund To {manipulateString(String(fundAddress))}
										</Button>
										:
										<Button fluid className="mt-3" variant="bordered_blue" title={fundAddress} onClick={transferToFund}>
											Loading...
										</Button>
								}

							</>
							:
							<>
								<h2>Web3Auth x Auth0 Demo App</h2>
								<Button className="mt-auto" fluid onClick={login}>
									Login
								</Button>
							</>
					}
				</div>
			</Container>
		</div>
	);
}

export default App;
