To access your Node.js server from your smartphone on the same WiFi network, follow these steps:

## 1. Find Your Computer's Local IP Address

**On Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (usually starts with 192.168.x.x)

**On macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
or
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

## 2. Update Your Node.js Server

Make sure your server is listening on all network interfaces (not just localhost):

```javascript
const express = require('express');
const app = express();
const PORT = 8000;

// Instead of:
// app.listen(PORT, 'localhost', () => { ... });

// Use this:
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Access from phone: http://YOUR_LOCAL_IP:${PORT}`);
});
```

## 3. Allow Firewall Access (If Needed)

**On Windows:**
- Open Windows Defender Firewall
- Allow Node.js or port 8000 through the firewall

**On macOS:**
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

## 4. Access from Your Smartphone

Open your phone's browser and navigate to:
```
http://YOUR_LOCAL_IP:8000
```

For example, if your computer's IP is `192.168.1.100`, use:
```
http://192.168.1.100:8000
```

## 5. Troubleshooting Tips

- **Check if nodemon is binding to 0.0.0.0** - some versions might default to localhost
- **Temporarily disable firewall** to test if that's the issue
- **Ensure both devices are on the same WiFi network**
- **Restart nodemon** after making changes to your server code

## Alternative: Use ngrok for External Access

If you want to access it from anywhere (not just same network), install ngrok:
```bash
npm install -g ngrok
ngrok http 8000
```

This will give you a public URL that works from any device.

Let me know if you need help with any specific step!