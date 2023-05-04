import * as Notifications from 'expo-notifications';
import { Expo } from 'expo-server-sdk';


// export const sendPushNotification = async (tokens, message) => {
//     try {
//       let expo = new Expo();
//       let messages = [];
//       for (let token of tokens) {
//         if (!Expo.isExpoPushToken(token)) {
//           console.error(`Push token ${token} is not a valid Expo push token`);
//           continue;
//         }
//         messages.push({
//           to: token,
//           sound: 'default',
//           title: message.title,
//           body: message.body,
//           data: message.data
//         });
//       }
//       let chunks = expo.chunkPushNotifications(messages);
//       let tickets = [];
//       for (let chunk of chunks) {
//         let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//         tickets.push(...ticketChunk);
//       }
//       let receiptIds = [];
//       for (let ticket of tickets) {
//         if (ticket.id) {
//           receiptIds.push(ticket.id);
//         }
//       }
//       let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
//       for (let chunk of receiptIdChunks) {
//         let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
//         let receiptsArr = Object.values(receipts);
//         for (let receipt of receiptsArr) {
//           if (receipt.status === 'ok') {
//             continue;
//           } else if (receipt.status === 'error') {
//             console.error(`There was an error sending a notification: ${receipt.message}`);
//             if (receipt.details && receipt.details.error) {
//               console.error(`The error message is: ${receipt.details.error}`);
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error(`Error sending a notification: ${error}`);
//     }
//   };

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

