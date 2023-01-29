import React, { useState } from 'react'
import { useUploader } from '@w3ui/react-uploader'

export default function Component () {
  const [, uploader] = useUploader()
  const [file, setFile] = useState(null)
  const [dataCid, setDataCid] = useState('')

  const handleUploadSubmit = async e => {
    e.preventDefault()
    const cid = await uploader.uploadFile(file)
    setDataCid(cid)
  }

  if (dataCid) {
    return (
      <div>
        <h1>Done!</h1>
        <p>{dataCid.toString()}</p>
        <p><a href={`https://${dataCid}.ipfs.w3s.link`}>View {file.name} on IPFS Gateway.</a></p>
      </div>
    )
  }

  return (
    <form onSubmit={handleUploadSubmit}>
      <div>
        <label htmlFor='file'>File:</label>
        <input id='file' type='file' onChange={e => setFile(e.target.files[0])} required />
      </div>
      <button type='submit'>Upload</button>
    </form>
  )
}