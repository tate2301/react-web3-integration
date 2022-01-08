import React from "react";
import "./style.css";
import Web3Modal from "web3modal";
import { useEffect, useState } from "react";
import contract_abi from "./network_abi.json";
import database_abi from "./database_abi.json";
import ListItem from "./ListItem";

const ethers = require("ethers");

const contract_address = "0x622Ab6481AB06A905275c5789E59649e3F145204";
const database_address = "0xE2e151ee35f2bf21d2771EbDFdd2cd48aF2B1761";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  async function connectWallet() {
    if (!window.provider) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      await provider.send("eth_requestAccounts", []);
      window.provider = provider;
    }

    setProvider(window.provider);

    window.ethereum.on("accountsChanged", function (accounts) {
      // Time to reload your interface with accounts[0]!
    });
  }

  const uploadPost = async (e) => {
    e.preventDefault();

    const post = e.target.post;
    const username = e.target.username;
    const signer = window.provider.getSigner();
    const address = await signer.getAddress();
    const options = {
      gasPrice: 1000000000,
      gasLimit: 85000,
      nonce: 45,
      value: 0,
    };

    const platformContract = new ethers.Contract(
      contract_address,
      contract_abi,
      signer
    );

    const result = await platformContract.Insert(
      {
        A_Post: post,
        A_UserName: username,
        A_UserAddress: address,
      },
      options
    );

    console.log({ result });
  };

  const getPosts = async (e) => {
    const databaseContract = new ethers.Contract(
      database_address,
      database_abi,
      provider
    );

    let totalPosts = await databaseContract.GetLength();
    // Fetch posts
    let posts_arr = [];
    for (let i = 0; i < parseInt(totalPosts.toString()); i++) {
      console.log(i);
      const record = await databaseContract.IdList(i);
      const post = await databaseContract.Table(record);
      const post_detail = {
        post: post[0].A_Post,
        address: post[0].A_UserAddress,
        username: post[0].A_UserName,
      };
      posts_arr.push(post_detail);
    }
    setPosts(posts_arr.reverse());
    setLoading(false);
  };

  useEffect(() => {
    if (provider) {
      getPosts();
    }
  }, [provider]);

  useEffect(() => {
    connectWallet();
  }, [window]);

  return (
    <div>
      {false && (
        <div className="py-4">
          <h3 className="text-sm font-semibold text-gray-800 text-lg mb-2">
            Create post
          </h3>
          <form onSubmit={uploadPost}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  type="username"
                  name="username"
                  id="username"
                  autoComplete="off"
                  required
                  className="w-full block bg-gray-50 p-1 rounded-md"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="post"
                className="block text-sm font-medium text-gray-700"
              >
                Post
              </label>
              <div className="mt-1">
                <textarea
                  type="post"
                  name="post"
                  id="post"
                  className="w-full block bg-gray-50 p-1 rounded-md"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="py-1 px-4 bg-orange-600 text-white font-semibold rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      {!loading ? (
        <div className="flow-root mt-2">
          <div className="my-2">
            <h3 className="text-sm font-semibold text-gray-800 text-lg mb-2">
              Posts
            </h3>
          </div>
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {posts.map((post, key) => (
              <ListItem
                post={post.post}
                username={post.username}
                address={post.address}
                key={key}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading posts</p>
      )}
    </div>
  );
}
