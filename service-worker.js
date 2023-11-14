self.addEventListener('push', (event) => {
    let notification = event.data.json();
    console.log(event.data.json());
    self.registration.showNotification(
      notification.content
    );
  });