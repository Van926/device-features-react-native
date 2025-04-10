import notifee from '@notifee/react-native';

export const sendNotification = async (title: string, body: string) => {
  try {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'travel',
      name: 'Travel Diary Notifications',
    });

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};