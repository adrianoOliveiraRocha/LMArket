const getWhatsappLink = (number, message) => {
  // option1: https://web.whatsapp.com/send?phone
  // option2: https://api.whatsapp.com/send?phone -> open app
  return `https://web.whatsapp.com/send?phone=${number}&text=%20${message}`;
}

module.exports = getWhatsappLink;

/*
You can create a WhatsApp link with a pre-filled message using a simple URL structure. This allows users to click the link and immediately open a chat with you on WhatsApp, with the message already typed in the text box.  Here's how:

**1. Basic Link Structure:**

```
https://wa.me/PHONE_NUMBER?text=YOUR_MESSAGE
```

* **`PHONE_NUMBER`:** Replace this with the recipient's phone number, including the country code but *without* any plus signs (+), dashes (-), or spaces.  For example, for a US number, it would be `1XXXXXXXXXX`.
* **`YOUR_MESSAGE`:** Replace this with the message you want pre-filled.  Use URL encoding for spaces and special characters.

**2. URL Encoding:**

Spaces in your message need to be replaced with `%20`. Other special characters also need to be encoded.  You can use a URL encoder tool (many are available online) or use JavaScript's `encodeURIComponent()` function.

**3. Example (Without Encoding):**

Let's say your phone number is 1234567890 (US) and you want the message "Hello, I have a question."

```
https://wa.me/1234567890?text=Hello, I have a question.
```

This will *mostly* work, but it's best to encode.

**4. Example (With Encoding):**

```javascript
const phoneNumber = "1234567890";
const message = "Hello, I have a question.";
const encodedMessage = encodeURIComponent(message);
const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

console.log(whatsappLink); // Output the link
//<a href=whatsappLink>Contact us on Whatsapp</a>
```

This will generate the following link:

```
https://wa.me/1234567890?text=Hello%2C%20I%20have%20a%20question.
```

**5.  Using `encodeURIComponent()` (Important):**

Always use `encodeURIComponent()` to ensure your message is correctly formatted, especially if it contains special characters, spaces, or other non-alphanumeric characters.

**6.  Creating the link in HTML:**

```html
<a href="https://wa.me/1234567890?text=Hello%2C%20I%20have%20a%20question." target="_blank">Contact us on WhatsApp</a>

<a id="whatsappLink" href="" target="_blank">Contact us on Whatsapp</a>
<script>
    const phoneNumber = "1234567890";
    const message = "Hello, I have a question.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    const linkElement = document.getElementById('whatsappLink');
    linkElement.href = whatsappLink;
</script>
```

The `target="_blank"` attribute opens the link in a new tab.

**7.  Shorter Link (Optional):**

You can also use a shorter link format:

```
https://api.whatsapp.com/send?phone=PHONE_NUMBER&text=YOUR_MESSAGE
```

This works the same way; just remember to URL-encode the message.

**Key Points:**

* **Country Code:**  Always include the country code in the phone number.
* **Encoding:**  URL encoding is crucial for reliable links.
* **Testing:**  Test your links thoroughly to ensure they work as expected.
* **Personal vs. Business:** This method works for both personal and business WhatsApp accounts.  However, for businesses, the WhatsApp Business API is the recommended approach for more advanced features and reliability.

*/


module.exports = getWhatsappLink;

/*
const getWhatsappLink = (number, message) => {
  return `https://api.whatsapp.com/send?phone=${number}&text=%20${message}`;
}
*/
