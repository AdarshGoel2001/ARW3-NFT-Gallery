import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import NftCard from "./components/NftCard";

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchCollection, setIfFetchCollection] = useState(false);
  const startToken = useRef(0);

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching NFTs");

    const apiKey = "BUqHdG6i2dPT6udk-X9sr7iVDwg5K3lc";
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };
    if (!collection.length) {
      console.log("no collection");
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("collection");

      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log(nfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  const fetchNFTsforCollection = async () => {
    let nfts;
    console.log("fetching NFTs for collection");

    const apiKey = "BUqHdG6i2dPT6udk-X9sr7iVDwg5K3lc";
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTsForCollection/`;
    var requestOptions = {
      method: "GET",
    };
    if (collection.length) {
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${
        startToken.current
      }`;
      console.log(fetchURL);
      // const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
      // console.log(nfts);
    }
    if (nfts) {
      setNFTs(nfts.nfts);
      console.log(NFTs);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchCollection}
          className="w-2/5 bg-slate-100 py-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder="Add your walletaddress"
        ></input>

        <input
          className="w-2/5 bg-slate-100 py-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          type={"text"}
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          placeholder="Add your collection address"
        ></input>
        <label className="text-gray-600">
          <input
            className="mr-2"
            type={"checkbox"}
            onChange={(e) => {
              setIfFetchCollection(e.target.checked);
            }}
          ></input>
          {"Fetch NFTs for collection"}
        </label>
        <button
          className="disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          onClick={() => {
            if (fetchCollection) fetchNFTsforCollection();
            else fetchNFTs();
          }}
        >
          Lets GO!!
        </button>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {NFTs.length &&
          NFTs.map((nft) => <NftCard key={nft.metadata.name} nft={nft} />)}
      </div>
      <div>
        <button
          className="text-5xl text-blue-800"
          onClick={() => {
            startToken.current = startToken.current - 100;
            fetchNFTsforCollection();
          }}
        >
          {"<"}
        </button>
        <button
          className="text-5xl text-blue-800"
          onClick={() => {
            startToken.current = startToken.current + 100;
            fetchNFTsforCollection();
          }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Home;
