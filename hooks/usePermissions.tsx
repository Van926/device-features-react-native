import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable' | 'limited';

const usePermissions = () => {
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus>('denied');
  const [locationPermission, setLocationPermission] = useState<PermissionStatus>('denied');
  const [notificationPermission, setNotificationPermission] = useState<PermissionStatus>('denied');

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    await checkCameraPermission();
    await checkLocationPermission();
    await checkNotificationPermission();
  };

  const checkCameraPermission = async () => {
    let status;
    if (Platform.OS === 'android') {
      status = await check(PERMISSIONS.ANDROID.CAMERA);
    } else {
      status = await check(PERMISSIONS.IOS.CAMERA);
    }
    setCameraPermission(status);
    return status;
  };

  const checkLocationPermission = async () => {
    let status;
    if (Platform.OS === 'android') {
      status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    } else {
      status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
    setLocationPermission(status);
    return status;
  };

  const checkNotificationPermission = async () => {
    let status;
    if (Platform.OS === 'android') {
      status = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    } else {
      status = await check(PERMISSIONS.IOS.NOTIFICATIONS);
    }
    setNotificationPermission(status);
    return status;
  };

  const requestCameraPermission = async () => {
    let status;
    if (Platform.OS === 'android') {
      status = await request(PERMISSIONS.ANDROID.CAMERA);
    } else {
      status = await request(PERMISSIONS.IOS.CAMERA);
    }
    setCameraPermission(status);
    return status;
  };

  const requestLocationPermission = async () => {
    let status;
    if (Platform.OS === 'android') {
      status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    } else {
      status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
    setLocationPermission(status);
    return status;
  };

  const requestNotificationPermission = async () => {
    let status;
    if (Platform.OS === 'android') {
      status = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    } else {
      status = await request(PERMISSIONS.IOS.NOTIFICATIONS);
    }
    setNotificationPermission(status);
    return status;
  };

  return {
    cameraPermission,
    locationPermission,
    notificationPermission,
    requestCameraPermission,
    requestLocationPermission,
    requestNotificationPermission,
  };
};

export default usePermissions;