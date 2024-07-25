import React, {useState} from 'react';
import MainNavigation from './src/Navigation/MainNavigation';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {ConfContext} from './src/Helper/ConfContext';

const App = () => {
  const [QrcodeData, setQrcodeData] = useState(false);
  return (
    <ConfContext.Provider value={{QrcodeData, setQrcodeData}}>
      <MainNavigation />
    </ConfContext.Provider>
  );
};

export default App;
