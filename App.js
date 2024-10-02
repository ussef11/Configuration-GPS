import React, {useState} from 'react';
import MainNavigation from './src/Navigation/MainNavigation';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {ConfContext} from './src/Helper/ConfContext';

const App = () => {
  const [QrcodeData, setQrcodeData] = useState(false);
  const [ConnectedDevice, setConnectedDevice] = useState();
  const [Tram, setTram] = useState();
  const [addBlur, setAddblur] = useState(false);
  const [ReciveData, setReciveData] = useState();

  return (
    <ConfContext.Provider
      value={{
        QrcodeData,
        setQrcodeData,
        ConnectedDevice,
        setConnectedDevice,
        Tram,
        setTram,
        addBlur,
        setAddblur,
        ReciveData,
        setReciveData,
      }}>
      <MainNavigation />
    </ConfContext.Provider>
  );
};

export default App;
