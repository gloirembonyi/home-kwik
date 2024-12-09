

// // Function to decode Base64URL
// function decodeBase64Url(base64Url) {
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   return JSON.parse(atob(base64));
// }

// // Split the JWT
// const parts = jwt.split('.');

// const header = decodeBase64Url(parts[0]);
// const payload = decodeBase64Url(parts[1]);

// console.log('Header:', header);
// console.log('Payload:', payload);