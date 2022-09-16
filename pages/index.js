import { useEffect, useState } from "react";
import FaucetCard from "./components/FaucetCard";
import Web3 from "web3";

export default function Home() {

  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
  })

  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadProvider = async () => {
      const provider = null;
      if (window.ethereum) {
        provider = window.ethereum;

        try {
          await provider.enable();
        }
        catch (error) {
          console.error(error);
        }
      }
      else if (window.web3) {
        provider = window.web3.currentProvider;
      }
      else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider("http://localhost:8545");
      }

      setWeb3Api({
        web3: new Web3(provider),
        provider
      });
    }

    loadProvider();
  }, [])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }

    web3Api.web3 && getAccount();
  }, [web3Api.web3])

  const requestAccounts = async () => {
    const accounts = await window.eth.request({ method: 'eth_requestAccounts' });
    console.log(accounts);
  }
  return (
    <div className='min-h-screen w-screen flex flex-col items-center justify-center gap-2'>
      <div className='px-6 py-2 bg-gray-800 rounded-lg text-white'>
        <h1>Current Account: </h1>
        <span>{account ? account : "you are not connected"}</span>
      </div>
      <FaucetCard requestAccounts={requestAccounts} />
    </div>
  )
}
