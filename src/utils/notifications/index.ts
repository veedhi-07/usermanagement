export const showNotification = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body, requireInteraction: true });
  }
  console.log(Notification.toString());
  console.log(Notification.name);
  console.log(Notification.length);
};
console.log(Notification.permission);
