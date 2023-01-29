import React, { useEffect } from 'react'
import { KeyringProvider, useKeyring } from '@w3ui/react-keyring'
import { UploaderProvider } from '@w3ui/react-uploader'
import ContentPage from './ContentPage'
//import UploadsList from './components/UploadsList'

function App () {
  return (
    <KeyringProvider>
      <UploaderProvider>
        <AgentLoader>
          <div className='vh-100 flex flex-column justify-center items-center sans-serif light-silver'>
            <div className='w-90 w-50-ns mw6'>
            <ContentPage />
            </div>
          </div>
        </AgentLoader>
      </UploaderProvider>
    </KeyringProvider>
  )
}

function AgentLoader ({ children }) {
  const [, { loadAgent }] = useKeyring()
  // eslint-disable-next-line
  useEffect(() => { loadAgent() }, []) // load agent - once.
  return children
}

export default App
