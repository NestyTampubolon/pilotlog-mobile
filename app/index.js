import React, { useCallback, useEffect, useState } from 'react';
import { useJwtAuth } from './Api/jwtAuth';
import { router, Link } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
// Keep the splash screen visible while we fetch resources


export default function App() {
  const { isLoggedIn, login } = useJwtAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function fetchDataAndPrepare() {
      try {
        // Mengambil informasi pengguna
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        console.log(storedUserInfo);
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }

        console.log(isLoggedIn);
        console.log(userInfo);

        // Menavigasi pengguna berdasarkan informasi yang didapat
        if (isLoggedIn && userInfo) {
          console.log("test 1");
          if (userInfo.role === "TRAINEE" || userInfo.role === 'TRAINEE_INSTRUCTOR' || userInfo.role === 'TRAINEE_CPTS') {
            router.replace('(tabs)');
          } else if (userInfo.role === 'INSTRUCTOR' || userInfo.role === 'INSTRUCTOR_CPTS') {
            router.replace('(tabsinstructor)');
          } else if (userInfo.role === 'CPTS') {
            router.replace('(tabscpts)');
          }
        } 
        else {
          console.log("test 2");
          router.replace('login');
        }
      } catch (e) {
        console.warn(e);
      } finally {
      }
    }

    // Memanggil fungsi fetchDataAndPrepare() saat komponen mount
    fetchDataAndPrepare();
  }, [isLoggedIn, userInfo]);



  // const onLayoutRootView = useCallback(async () => {
  //   if (appIsReady) {
  //     // This tells the splash screen to hide immediately! If we call this after
  //     // `setAppIsReady`, then we may see a blank screen while the app is
  //     // loading its initial state and rendering its first pixels. So instead,
  //     // we hide the splash screen once we know the root view has already
  //     // performed layout.
  //     await SplashScreen.hideAsync();
  //   }
  // }, [appIsReady]);

  // if (!appIsReady) {
  //   return null;
  // }

  // return (
  //   <View
  //     style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
  //     onLayout={onLayoutRootView}>
  //     <Text>SplashScreen Demo! 👋</Text>
  //     <Entypo name="rocket" size={30} />
  //   </View>
  // );
}