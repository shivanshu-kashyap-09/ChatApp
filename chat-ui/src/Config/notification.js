import axios from "axios";
import API_BASE_URL from "../config";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "BL1466Kn25R9xtIVcMNpM5H9oWTguAwKqxKttVPZrLyxzYPXiYFtt8aFbt7k8kmUq04exizlWMdiuqt2Z4YDVJw";

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const subscribeToNotifications = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.log("Push notifications are not supported in this browser.");
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.log("Permission not granted for notifications.");
            return;
        }

        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        const userEmail = localStorage.getItem("loginEmail");
        if (!userEmail) return;

        // Send subscription to backend
        const subscriptionData = {
            userEmail: userEmail,
            endpoint: subscription.endpoint,
            p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("p256dh")))),
            auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey("auth")))),
        };

        await axios.post(`${API_BASE_URL}/api/notifications/subscribe`, subscriptionData);
        console.log("Subscribed to push notifications successfully.");
    } catch (error) {
        console.error("Error subscribing to push notifications:", error);
    }
};
