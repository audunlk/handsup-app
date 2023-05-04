import * as Notifications from 'expo-notifications';




export const schedulePushNotification = async (expoPushToken, title, body, time) => {
    await Notifications.scheduleNotificationAsync({
        content: {
        title: title,
        body: body,
        data: { data: 'goes here' },
        },
        trigger: time,
    });
    }

export const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    }

export const cancelNotification = async (id) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    }

export const getAllScheduledNotifications = async () => {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
    }

