import type { NextPage } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction, erc721ABI} from 'wagmi'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import * as CurationManager from "../contractABI/CurationManager.json";
import { BigNumber } from 'ethers'

const allContent = "#00C2FF"
const clickables = "#7DE0FF"
const background = "#0E0411"

const Curate: NextPage = () => {

    const [tokenGateAddress, setTokenGateAddress] = useState("")

    const [collection, setCollection] = useState({
        collectionAddress: ""
    })

    const [userAddress, setUserAddress] = useState("");
    const { address: account } = useAccount({}); 

    const getCurrentUserAddress = () => {
        const currentUserAddress = account ? account : ""
        setUserAddress(currentUserAddress)
        console.log("currentUseraddress: ", currentUserAddress)
    }

    // CuratorContract Read Call --> TokenGateAddress Check
    const { data: curationPassData, isError: curationPassError, isLoading: tokeGateAddressLoading, isSuccess: tokeGateAddressSuccess, isFetching: tokeGateAddressFetching  } = useContractRead({
        addressOrName: "0x6422Bf82Ab27F121a043d6DE88b55FA39e2ea292",
        contractInterface: CurationManager.abi,
        functionName: 'curationPass',
        watch: true,
        onError(curationPassError) {
            console.log("error: ", curationPassError)
        },
        onSuccess(curationPassData) {
            console.log("what is the curationpass ", curationPassData)
        }  
    })  

    const tokenGateAddressCheck = curationPassData ? curationPassData.toString() : ""

    // curation pass balance check
    const { data: balanceData, isError: balanceError, isLoading: balanceLoading, isSuccess: balanceSuccess, isFetching: balanceFetching  } = useContractRead({
        addressOrName: tokenGateAddressCheck,
        contractInterface: erc721ABI,
        functionName: 'balanceOf',
        watch: true,
        args: [
            userAddress
        ],
        onError(balanceError) {
            console.log("what is balance error: ", balanceError)
        },
        onSuccess(balanceData) {
            console.log("successington : ", balanceData)
            console.log("is this it", BigNumber.from(balanceData).toString())
        }
    })  
    
    const curationPassBalance = balanceData ? Number(BigNumber.from(balanceData).toBigInt()) : 0;  

    // add listing call
    const { 
        data: addCollectionData, 
        isError: addCollectionError, 
        isLoading: addCollectionLoading, 
        write: addCollectionWrite 
    } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: "0x6422Bf82Ab27F121a043d6DE88b55FA39e2ea292",
        contractInterface: CurationManager.abi,
        functionName: 'addListing',
        args: [
            collection.collectionAddress
        ]
    })    

    // Wait for data from add listing call
    const { data: addWaitData, isError: addWaitError, isLoading: addWaitLoading } = useWaitForTransaction({
        hash:  addCollectionData?.hash,
        onSuccess(addWaitData) {
            console.log("txn complete: ", addWaitData)
            console.log("txn hash: ", addWaitData.transactionHash)
        }
    })          

    // remove collection call
    const { 
        data: removeCollectionData, 
        isError: removeCollectionError, 
        isLoading: removeCollectionLoading, 
        write: removeCollectionWrite 
    } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: "0x6422Bf82Ab27F121a043d6DE88b55FA39e2ea292",
        contractInterface: CurationManager.abi,
        functionName: 'removeListing',
        args: [
            collection.collectionAddress,
        ]
    })        

    // Wait for data from remove listing call
    const { data: removeWaitData, isError: removeWaitError, isLoading: removeWaitLoading } = useWaitForTransaction({
        hash:  removeCollectionData?.hash,
        onSuccess(removeWaitData) {
            console.log("txn complete: ", removeWaitData)
            console.log("txn hash: ", removeWaitData.transactionHash)
        }
    })            

    // Update state of userAddress whenever wallet changes
    useEffect(() => {
        getCurrentUserAddress(),
        [account]
    })

    return (
        <div className=' h-screen min-h-screen  bg-[#0E0411]'>
            <Header/>            
            <Head>
            <title>Present Material</title>
            <meta name="description" content="A Web3 Record Store" />
            <link rel="icon" href="/graphics/1_1.png" />
            <meta name="og:title" content="Songcamp: Present Material" />
            <meta
            property="og:image"
            content="https://www.presentmaterial.xyz/graphics/mobile_preview.png"
            />
            <meta name="twitter:card" content="summary_large_image"
            />
            <meta name="twitter:description" content="A Web3 Record Store"
            />

            <meta name="twitter:title" content="Songcamp: Present Material"
            />

            <meta name="twitter:image" content="https://www.presentmaterial.xyz/graphics/16_9.png"
            />           
            <link rel="icon" href="https://www.presentmaterial.xyz/graphics/mobile_preview.png" />
            <link rel="apple-touch-icon" href="https://www.presentmaterial.xyz/graphics/mobile_preview.png" />
            </Head>
            <main className={`border-t-2 border-solid border-[#00c2ff] mt-[80px] mb-[80px] sm:mb-0 h-full flex flex-row sm:flex-col flex-wrap text-[#00C2FF] text-[16px]`}>
                <div className=" relative z-1 w-[100%] h-[60%] sm:border-r-2 border-solid border-[#00c2ff] sm:h-full  sm:w-[55%] flex flex-row flex-wrap justify-center content-start">                              
                    <Image
                        src={"/graphics/access_token_final.jpg"}
                        layout={"fill"}                              
                        // objectFit={"contain"}    
                        // objectPosition={"top"}                                                  
                    />                
                </div>                
                <div className="mt-5 sm:mt-0 z-1 flex flex-col flex-wrap  sm:h-full  w-full sm:w-5/12  justify-start sm:justify-center items-center">
                    <svg width="183" height="73" viewBox="0 0 183 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.55027 33.5971C6.77115 33.5971 4.61115 32.6753 3.07025 30.818C1.52935 28.9607 0.731388 26.3329 0.662598 22.9071H4.74873C4.88631 24.8333 5.32656 26.2091 6.05574 27.062C6.79867 27.9013 7.89931 28.3278 9.38518 28.3278C10.5546 28.3278 11.5177 27.9838 12.2606 27.3097C13.0035 26.6356 13.3888 25.5899 13.3888 24.1729C13.3888 23.6638 13.3475 23.196 13.2649 22.7971C13.1824 22.3981 13.0035 22.0266 12.7284 21.7102C12.4532 21.3937 12.2331 21.1323 12.0405 20.9397C11.8479 20.7471 11.4902 20.5408 10.9811 20.3069C10.4583 20.0867 10.0731 19.9216 9.79792 19.8116C9.52275 19.7015 9.02747 19.5227 8.29829 19.2475C7.41778 18.9173 6.68861 18.6284 6.12453 18.3945C5.56045 18.1606 4.94134 17.7754 4.25344 17.2663C3.56554 16.7573 3.02898 16.1932 2.64375 15.5741C2.24477 14.955 1.91458 14.1433 1.65317 13.1389C1.37801 12.1346 1.25419 10.9789 1.25419 9.68568C1.24043 6.60389 1.95585 4.21 3.4142 2.54528C4.85879 0.880559 6.7574 0.0413208 9.12377 0.0413208C11.4902 0.0413208 13.3337 0.908075 14.737 2.65534C16.1404 4.40261 16.9108 6.87905 17.0621 10.0984H13.0586C12.9485 8.53001 12.522 7.33306 11.8066 6.49383C11.0912 5.65459 10.1831 5.22809 9.0825 5.22809C7.98186 5.22809 7.04631 5.57204 6.37217 6.25994C5.69803 6.94784 5.36784 7.86963 5.36784 9.01154C5.36784 10.2498 5.69803 11.144 6.35841 11.7219C7.0188 12.2997 8.18823 12.8638 9.85295 13.4416C10.8435 13.7718 11.669 14.0745 12.3019 14.3634C12.9347 14.6523 13.6226 15.0513 14.3656 15.5741C15.1085 16.0969 15.6863 16.6748 16.0853 17.3076C16.4843 17.9405 16.842 18.7797 17.1172 19.8116C17.3923 20.8434 17.5299 22.0404 17.5299 23.4024C17.5299 26.5943 16.787 29.0845 15.3149 30.8868C13.8428 32.6891 11.9029 33.5971 9.53651 33.5971H9.55027Z" fill="#00C2FF"/>
                    <path d="M18.1217 6.13614V0.632935H34.6588V6.13614H28.4677V32.868H24.299V6.13614H18.1079H18.1217Z" fill="#00C2FF"/>
                    <path d="M51.8426 28.8781C50.0403 32.0149 47.6464 33.5833 44.6471 33.5833C41.6479 33.5833 39.254 32.0149 37.438 28.8781C35.6219 25.7412 34.7139 21.7101 34.7139 16.8123C34.7139 11.9144 35.6219 7.88334 37.438 4.73276C39.254 1.58217 41.6479 0 44.6471 0C47.6464 0 50.0403 1.58217 51.8426 4.73276C53.6449 7.88334 54.5529 11.9144 54.5529 16.8123C54.5529 21.7101 53.6449 25.7275 51.8426 28.8781ZM40.4647 25.0258C41.4553 27.1583 42.8586 28.2314 44.6747 28.2314C46.4907 28.2314 47.8803 27.1721 48.8433 25.0533C49.8064 22.9346 50.2879 20.1968 50.2879 16.826C50.2879 13.4553 49.8064 10.7037 48.8433 8.57124C47.8803 6.43875 46.4907 5.36562 44.6747 5.36562C42.8586 5.36562 41.4415 6.43875 40.4647 8.57124C39.4741 10.7037 38.9789 13.4553 38.9789 16.826C38.9789 20.1968 39.4741 22.8933 40.4647 25.0258Z" fill="#00C2FF"/>
                    <path d="M56.5483 32.868V0.632935H65.9863C67.9675 0.632935 69.5634 1.45841 70.7741 3.10938C71.9848 4.76034 72.6039 6.92034 72.6039 9.60316C72.6039 13.7168 71.352 16.3171 68.8342 17.4039V17.5415C69.8111 17.9955 70.554 18.711 71.0355 19.6878C71.5171 20.6646 71.8335 22.1092 71.9711 24.0353C72.0123 24.7507 72.0536 25.6037 72.0949 26.5805C72.1362 27.5574 72.1774 28.3278 72.205 28.9056C72.2325 29.4835 72.2737 30.0476 72.315 30.6254C72.3701 31.1895 72.4251 31.6435 72.5214 31.9599C72.6039 32.2764 72.714 32.4827 72.8516 32.5653V32.8817H68.848C68.7655 32.8267 68.7104 32.7166 68.6416 32.5378C68.5866 32.3727 68.5316 32.1388 68.5041 31.8361C68.4628 31.5334 68.4353 31.2307 68.4077 30.9143C68.3802 30.5979 68.3527 30.1851 68.3252 29.7036C68.2977 29.2083 68.2702 28.7681 68.2564 28.3966C68.2427 28.0251 68.2151 27.5298 68.1876 26.9107C68.1601 26.2916 68.1326 25.8101 68.1188 25.4524C67.9537 21.779 66.6054 19.9492 64.0877 19.9492H60.717V32.8955H56.5483V32.868ZM60.717 5.90225V14.8725H65.1471C66.234 14.8725 67.087 14.4597 67.6648 13.648C68.2426 12.8363 68.5453 11.7632 68.5453 10.4424C68.5453 9.12163 68.2702 7.99347 67.7061 7.15423C67.142 6.31499 66.3303 5.88849 65.2572 5.88849H60.717V5.90225Z" fill="#00C2FF"/>
                    <path d="M74.9976 32.868V0.632935H90.1314V6.13614H79.1662V13.3453H88.7693V18.711H79.1662V27.406H90.2139V32.868H74.9976Z" fill="#00C2FF"/>
                    <path d="M92.4702 32.868V0.632935H107.205V6.17741H96.6526V13.9369H105.595V19.5227H96.6526V32.868H92.484H92.4702Z" fill="#00C2FF"/>
                    <path d="M108.705 32.868V0.632935H118.143C120.124 0.632935 121.72 1.45841 122.93 3.10938C124.141 4.76034 124.76 6.92034 124.76 9.60316C124.76 13.7168 123.508 16.3171 120.99 17.4039V17.5415C121.967 17.9955 122.71 18.711 123.192 19.6878C123.673 20.6646 123.99 22.1092 124.127 24.0353C124.169 24.7507 124.21 25.6037 124.251 26.5805C124.292 27.5574 124.334 28.3278 124.361 28.9056C124.389 29.4835 124.43 30.0476 124.471 30.6254C124.526 31.1895 124.581 31.6435 124.678 31.9599C124.76 32.2764 124.87 32.4827 125.008 32.5653V32.8817H121.004C120.922 32.8267 120.867 32.7166 120.798 32.5378C120.743 32.3727 120.688 32.1388 120.66 31.8361C120.619 31.5334 120.592 31.2307 120.564 30.9143C120.536 30.5979 120.509 30.1851 120.481 29.7036C120.454 29.2083 120.426 28.7681 120.413 28.3966C120.399 28.0251 120.371 27.5298 120.344 26.9107C120.316 26.2916 120.289 25.8101 120.275 25.4524C120.11 21.779 118.762 19.9492 116.244 19.9492H112.873V32.8955H108.705V32.868ZM112.873 5.90225V14.8725H117.303C118.39 14.8725 119.243 14.4597 119.821 13.648C120.399 12.8363 120.702 11.7632 120.702 10.4424C120.702 9.12163 120.426 7.99347 119.862 7.15423C119.298 6.31499 118.487 5.88849 117.413 5.88849H112.873V5.90225Z" fill="#00C2FF"/>
                    <path d="M143.141 28.8781C141.339 32.0149 138.945 33.5833 135.945 33.5833C132.946 33.5833 130.552 32.0149 128.736 28.8781C126.92 25.7412 126.012 21.7101 126.012 16.8123C126.012 11.9144 126.92 7.88334 128.736 4.73276C130.552 1.58217 132.946 0 135.945 0C138.945 0 141.339 1.58217 143.141 4.73276C144.943 7.88334 145.851 11.9144 145.851 16.8123C145.851 21.7101 144.943 25.7275 143.141 28.8781ZM131.763 25.0258C132.754 27.1583 134.157 28.2314 135.973 28.2314C137.789 28.2314 139.179 27.1721 140.142 25.0533C141.105 22.9346 141.586 20.1968 141.586 16.826C141.586 13.4553 141.105 10.7037 140.142 8.57124C139.179 6.43875 137.789 5.36562 135.973 5.36562C134.157 5.36562 132.74 6.43875 131.763 8.57124C130.772 10.7037 130.277 13.4553 130.277 16.826C130.277 20.1968 130.772 22.8933 131.763 25.0258Z" fill="#00C2FF"/>
                    <path d="M147.846 32.868V0.632935H152.069L158.921 18.6284C159.114 19.1375 159.334 19.7703 159.568 20.527C159.801 21.2837 159.994 21.9028 160.132 22.4256L160.365 23.141H160.421C160.338 20.9122 160.31 19.0549 160.31 17.5553V0.632935H164.424V32.868H160.393L153.376 15.0513C153.184 14.5423 152.964 13.9094 152.716 13.1802C152.468 12.4373 152.276 11.8182 152.138 11.3092L151.904 10.58H151.849C151.932 12.8363 151.959 14.7074 151.959 16.2208V32.8542H147.846V32.868Z" fill="#00C2FF"/>
                    <path d="M165.8 6.13614V0.632935H182.338V6.13614H176.146V32.868H171.978V6.13614H165.787H165.8Z" fill="#00C2FF"/>
                    <path d="M25.3857 72.3259V40.0909H31.2604L34.1634 56.2841C34.3697 57.481 34.5899 58.8155 34.81 60.2739C35.0301 61.7322 35.1952 62.8879 35.319 63.7271L35.4566 64.9929H35.5116C35.8693 61.8973 36.2958 58.9944 36.7774 56.2841L39.6803 40.0909H45.6375V72.3259H41.7578V53.8351L41.9366 47.1625H41.8816C41.5789 49.694 41.2762 51.7302 40.9873 53.2986L37.4515 72.3259H33.4479L29.9947 53.2986L29.1004 47.1625H29.0454C29.1554 49.8728 29.2242 52.0879 29.2242 53.8351V72.3259H25.3995H25.3857Z" fill="#00C2FF"/>
                    <path d="M46.8071 72.3259L53.9751 40.0909H58.2951L65.5455 72.3259H61.198L59.8222 65.4744H52.4066L51.0584 72.3259H46.8346H46.8071ZM55.2133 51.1798L53.3697 60.4665H58.8041L56.9605 51.1798L56.1213 46.2132H56.0663C55.7223 48.3732 55.4334 50.0379 55.1995 51.1798H55.2133Z" fill="#00C2FF"/>
                    <path d="M66.729 72.3259V40.0909H70.9527L77.8042 58.0864C77.9968 58.5954 78.2169 59.2283 78.4508 59.985C78.6847 60.7417 78.8773 61.3745 79.0149 61.8836L79.2488 62.599H79.3038C79.2213 60.3702 79.1938 58.5129 79.1938 57.0132V40.1046H83.3074V72.3397H79.2763L72.2597 54.523C72.0671 54.014 71.847 53.3949 71.5993 52.6519C71.3517 51.909 71.1591 51.2899 71.0215 50.7809L70.7876 50.0517H70.7326C70.8151 52.308 70.8426 54.1928 70.8426 55.6925V72.3259H66.729Z" fill="#00C2FF"/>
                    <path d="M84.4629 72.3259L91.6308 40.0909H95.9508L103.201 72.3259H98.8538L97.478 65.4744H90.0624L88.7141 72.3259H84.4904H84.4629ZM92.869 51.1798L91.0255 60.4665H96.4599L94.6163 51.1798L93.7771 46.2132H93.722C93.3781 48.3732 93.0892 50.0379 92.8553 51.1798H92.869Z" fill="#00C2FF"/>
                    <path d="M118.596 72.3258L118.459 67.992H118.404C117.138 71.3352 115.212 72.9999 112.625 72.9999C109.612 72.9999 107.205 71.4453 105.403 68.3085C103.614 65.1854 102.72 61.1818 102.72 56.3115C102.72 50.7808 103.848 46.3919 106.09 43.1451C107.81 40.6824 110.025 39.4442 112.708 39.4442C115.226 39.4442 117.234 40.421 118.734 42.3746C120.234 44.3282 121.169 46.9423 121.513 50.2167H117.427C117.179 48.5932 116.657 47.3 115.872 46.3232C115.088 45.3463 114.056 44.851 112.791 44.851C110.933 44.851 109.502 45.9242 108.484 48.0567C107.48 50.1892 106.971 52.9408 106.971 56.3115C106.971 59.6822 107.494 62.3788 108.539 64.5112C109.585 66.6437 110.975 67.7169 112.722 67.7169C114.263 67.7169 115.528 66.9739 116.519 65.4881C117.51 64.0022 118.019 62.31 118.019 60.4114V60.2325H113.066V55.1833H121.72V72.3258H118.583H118.596Z" fill="#00C2FF"/>
                    <path d="M124.43 72.3259V40.0909H139.564V45.5941H128.599V52.8033H138.202V58.1689H128.599V66.864H139.647V72.3259H124.43Z" fill="#00C2FF"/>
                    <path d="M141.903 72.3259V40.0909H151.341C153.322 40.0909 154.918 40.9164 156.129 42.5673C157.339 44.2183 157.958 46.392 157.958 49.0611C157.958 53.1747 156.706 55.775 154.189 56.8619V56.9995C155.166 57.4535 155.908 58.1689 156.39 59.1457C156.885 60.1225 157.188 61.5809 157.326 63.4933C157.367 64.2087 157.408 65.0617 157.449 66.0385C157.491 67.0153 157.532 67.7858 157.559 68.3636C157.587 68.9414 157.628 69.5055 157.67 70.0833C157.725 70.6474 157.78 71.1014 157.876 71.4179C157.958 71.7343 158.068 71.9407 158.206 72.0232V72.3397H154.202C154.12 72.2846 154.065 72.1746 153.996 71.9957C153.941 71.8306 153.886 71.5967 153.859 71.294C153.817 70.9914 153.79 70.6887 153.762 70.3723C153.735 70.0558 153.707 69.6431 153.68 69.1616C153.652 68.6663 153.625 68.226 153.611 67.8545C153.597 67.4831 153.57 66.9878 153.542 66.3687C153.515 65.7496 153.487 65.268 153.473 64.9103C153.308 61.2369 151.96 59.4071 149.442 59.4071H146.072V72.3534H141.903V72.3259ZM146.072 45.3602V54.3304H150.502C151.588 54.3304 152.441 53.9314 153.019 53.1197C153.597 52.308 153.9 51.2349 153.9 49.9141C153.9 48.5933 153.625 47.4652 153.061 46.6259C152.496 45.7867 151.685 45.3602 150.612 45.3602H146.072Z" fill="#00C2FF"/>
                    </svg>                    
                    <div className=" text-[16px] mt-6 text-center mb-5 sm:mb-20  w-8/12 sm:w-6/12" >
                        {"If you own "} 
                        <a 
                        className="hover:underline  text-[#7DE0FF] hover:text-[#7DE0FF]"
                        href={"https://create.zora.co/editions/0xde3bdb68263a2ce6d98e00450f9a2ea7197cbb99"}
                        >
                        $PRESENT
                        </a>   
                        {" you can update the "}
                        <a 
                        className="text-[#7DE0FF] hover:underline hover:text-[#7DE0FF]"
                        href="https://etherscan.io/address/0x6422Bf82Ab27F121a043d6DE88b55FA39e2ea292"
                        >
                        storefront
                        </a>                    
                    </div>
                    { curationPassBalance > 0 ? (          
                    <div className="flex flex-row flex-wrap justify-center">          
                        <div className="mb-5 sm:mb-20 flex flex-row w-full justify-center">
                            <div className=" mb-2 flex items-center  text-[16px]" >
                            {"Are you a manager? "}  
                            </div>
                            <div className=" text-[16px] font-font-semibold ml-8 bg-[#00c2ff] text-black  mb-2  w-fit px-1  justify-self-center flex items-center">
                                {"Yes"}
                            </div>
                        </div>                                        
                        <input         
                            required
                            type="text"           
                            className={`w-[60%] hover:border-[#7DE0FF] bg-[#1a0121] placeholder:text-[#1784A5] pl-1 hover:placeholder-text-[#7DE0FF] border-[#00C2FF] border-2 border-solid pl-[1px] mb-4`}
                            placeholder='ZORA Edition Address: 0xa97d . . .'
                            value={collection.collectionAddress}
                            onChange={(e) => {
                                e.preventDefault();
                                setCollection(current => {
                                    return {
                                        ...current,
                                        collectionAddress: e.target.value
                                    }
                                })
                            }}
                        >
                        </input>
                        <div className=" flex justify-center w-full font-semibold text-[16px]">


                            { addWaitLoading == true ? (
                            <button 
                                className="w-[93px] h-[45px] border-2 border-solid border-black bg-[#00C2FF] hover:bg-[#7DE0FF] hover:border-[#7DE0FF] text-black"
                                disabled={true}
                            >
                                <div className='flex flex-row justify-center flex-wrap'>
                                    <img
                                    className=" rounded-full p-1 " 
                                    width="25px"
                                    src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                                    />
                                </div>
                            </button>
                            ) : (
                                <button 
                                className="w-[93px] h-[45px]  mb-2 border-2 border-solid border-black bg-[#00C2FF] hover:bg-[#7DE0FF] hover:border-[#7DE0FF] text-black"
                                onClick={() => addCollectionWrite()}
                            >
                                Add
                            </button>
                            )}
                            { removeWaitLoading == true ? (
                            <button 
                                className="w-[93px] h-[45px]  mb-2 border-2 border-solid border-black bg-[#00C2FF] hover:bg-[#7DE0FF] hover:border-[#7DE0FF] text-black"
                                disabled={true}
                            >
                                <div className='flex flex-row justify-center flex-wrap'>
                                    <img
                                    className=" rounded-full p-1" 
                                    width="25px"
                                    src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                                    />
                                </div>
                            </button>
                            ) : (
                                <button 
                                className="w-[93px] h-[45px]  mb-2 border-2 border-solid border-black bg-[#00C2FF] hover:bg-[#7DE0FF] hover:border-[#7DE0FF] text-black"
                                onClick={() => removeCollectionWrite()}
                            >
                                Remove
                            </button>
                            )}                           
                        </div>
                    </div>
                    ) : ( 
                        <div>          
                            <div className=" flex flex-row flex-wrap justify-center">
                                <div className="mb-5 sm:mb-20 flex flex-row w-full justify-center">
                                    <div className=" mb-2 flex items-center text-[16px]" >
                                        {"Current wallet does not own "} 
                                        <a 
                                        className="pl-1 hover:underline text-[#7DE0FF] hover:text-[#7DE0FF]"
                                        href={"https://create.zora.co/editions/0xde3bdb68263a2ce6d98e00450f9a2ea7197cbb99"}
                                        >
                                        $PRESENT
                                        </a>   
                                    </div>
                                </div> 
                                <input   
                                    disabled={true}      
                                    required
                                    type="text"           
                                    className={`w-[60%] bg-[#1a0121] placeholder:text-[#00C2FF] pl-1 border-[#00C2FF] opacity-25 border-2 border-solid pl-[1px] mb-4`}
                                    placeholder='ZORA Edition Address: 0xa97d . . .'
                                    value={collection.collectionAddress}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setCollection(current => {
                                            return {
                                                ...current,
                                                collectionAddress: e.target.value
                                            }
                                        })
                                    }}
                                />
                                <div className=" flex justify-center w-full font-semibold text-[16px]">
                                    <button 
                                        disabled={true}
                                        className="w-[93px] h-[45px] border-2 border-solid border-black bg-[#00C2FF] opacity-25 text-black"
                                        onClick={() => addCollectionWrite()}
                                    >
                                        Add
                                    </button>
                                    <button 
                                        disabled={true}
                                        className="w-[93px] h-[45px] m-0 p-[0p] border-2 border-solid border-black bg-[#00C2FF] opacity-25 text-black"
                                        onClick={() => removeCollectionWrite()}
                                    >
                                        Remove
                                    </button>             
                                </div>                                
                            </div>
                        </div>                
                    )}
                </div>
                
            </main>
            <Footer />
        </div>
    )
}

export default Curate
