import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useCachedResources from './src/hooks/useCachedReources';
import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Navigation colorScheme={colorScheme}>
        <StatusBar />
      </Navigation>   
    </SafeAreaProvider>
  );
}
