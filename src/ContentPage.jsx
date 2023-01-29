import React, { useState } from 'react'
import { useUploader } from '@w3ui/react-uploader'
import { withIdentity } from './components/Authenticator'
import './spinner.css'
import {abi} from './config';
import { Contract, ethers } from 'ethers';

// For smart Contract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contractAddress ='0xD082e7057C9531A13AddCe15436E833917Cd8D77';
  const contractABI = abi;
  const filfy =new Contract(
    contractAddress,
    contractABI,
    signer
  );

export function ContentPage () {
  const [{ storedDAGShards }, uploader] = useUploader()
  const [file, setFile] = useState(null)
  const [dataCid, setDataCid] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState(null)

  //fuction to add CID in contract
  async function addCID(){
    console.log("IN Func");
    var newCid;
    error ? console.log(error) : newCid = await filfy.addSongs(dataCid);
    await newCid.wait()
    console.log(newCid.hash)
  }

  if (!uploader) return null

  const handleUploadSubmit = async e => {
    e.preventDefault()
    try {
      setStatus('uploading')
      const cid = await uploader.uploadFile(file)
      setDataCid(cid)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setStatus('done')
    }
  }

  if (status === 'uploading') {
    return <Uploading file={file} storedDAGShards={storedDAGShards} />
  }

  if (status === 'done') {
    addCID(); // SOLVE THIS ISSUE calling twice
    return error ? <Errored error={error} /> : <Done file={file} dataCid={dataCid} storedDAGShards={storedDAGShards} />
  }

  return (
    <form onSubmit={handleUploadSubmit}>
      <div className='db mb3'>
        <label htmlFor='file' className='db mb2'>File:</label>
        <input id='file' className='db pa2 w-100 ba br2' type='file' onChange={e => setFile(e.target.files[0])} required />
      </div>
      <button type='submit' className='ph3 pv2'>Upload</button>
    </form>
  )
}

const Uploading = ({ file, storedDAGShards }) => (
  <div className='flex items-center'>
    <div className='spinner mr3 flex-none' />
    <div className='flex-auto'>
      <p className='truncate'>Uploading DAG for {file.name}</p>
      {storedDAGShards.map(({ cid, size }) => (
        <p key={cid.toString()} className='f7 truncate'>
          {cid.toString()} ({size} bytes)
        </p>
      ))}
    </div>
  </div>
)

const Errored = ({ error }) => (
  <div>
    <h1 className='near-white'>⚠️ Error: failed to upload file: {error.message}</h1>
    <p>Check the browser console for details.</p>
  </div>
)

const Done = ({ file, dataCid, storedDAGShards }) => (
  <div>
    <h1 className='near-white'>Done!</h1>
    <p className='f6 code truncate'>{dataCid.toString()}</p>
    <p><a href={`https://w3s.link/ipfs/${dataCid}`} className='blue'>View {file.name} on IPFS Gateway.</a></p>
    {/* <audio src={`https://w3s.link/ipfs/${dataCid}`} className='blue'></audio> */}
    <p className='near-white'>Chunks ({storedDAGShards.length}):</p>
    {storedDAGShards.map(({ cid, size }) => (
      <p key={cid.toString()} className='f7 truncate'>
        {cid.toString()} ({size} bytes)
      </p>
    ))}
  </div>
)

export default withIdentity(ContentPage)
