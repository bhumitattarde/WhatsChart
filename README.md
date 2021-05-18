# WhatsChart

###### WhatsChart is a free and open-source chat analyzer + visualizer for WhatsApp that lets you create customizable visualizations instantly.

## Demo visualization

![Demo visualization](public/demo.png?raw=true)

## Table of contents

- [Why use WhatsChart?](https://github.com/bhumitattarde/WhatsChart#why-use-whatschart)
- [How to use?](https://github.com/bhumitattarde/WhatsChart#how-to-use)
- [How to report bugs or offer suggestions?](https://github.com/bhumitattarde/WhatsChart#how-to-report-bugs-or-offer-suggestions)
- [Testing](https://github.com/bhumitattarde/WhatsChart#Testing)
- [Documentation for developers](https://github.com/bhumitattarde/WhatsChart#documentation-for-developers)
- [License](https://github.com/bhumitattarde/WhatsChart#License)

## Why use WhatsChart?

- ### Maximum privacy

  WhatsChart works locally, which means NO data, including the chat you select, is ever sent to ANY server! WhatsChart does NOT collect any analytics or other data either.

- ### Completely open-source and free

  WhatsChart does not charge you anything! Anyone, including you, can read the source code anytime!

- ### Instant and customizable
  WhatsChart works instantly! One click and off you go! Additionally, WhatsChart is highly customizable and new customization options are still being added.

## How to use?

### 1. Export your WhatsApp chats

1. Open the chat.
2. Tap `More options > More > Export chat` for Android. For iPhone Tap the `contact's name or group subject > Export Chat`.
3. Choose to export with media. If you decide to leave media out, you won't get statistics about media like pictures, videos etc.
4. File with name like `chat.txt` or `WhatsApp chat with John.txt` is the file you'll need. WhatsApp unfortunately doesn't follow a consistent pattern while naming the chat file. If a `zip` file was exported, unzip it to find the `.txt` chat file. Feel free to discard the exported media.
5. If you're still having trouble exporting your chats, refer to the following links from WhatsApp FAQ:
   - [Android](https://faq.whatsapp.com/android/chats/how-to-save-your-chat-history/?lang=en)
   - [iPhone](https://faq.whatsapp.com/iphone/chats/how-to-back-up-to-icloud/?lang=en)

### 2.

- #### Hosted version:

  Prefer this way since you don't have to download/install anything.
  Head over to [whatschart.bhumit.net](whatschart.bhumit.net)

- #### Offline version:

  1.  Clone the repo.
  2.  Install the dependencies using `npm install`.
  3.  Issue `npm start` command.
  4.  Visit your localhost on specified port.
  5.  **Keep in mind that fonts won't work since they're pulled from Google fonts (unless you download them too).**

### 3.

Go to generate page, select the exported chat file, configuration and click on Generate.
You can then see/download the generated visualization. It is HIGHLY recommended that you use desktop or a device with wide screen to download the visualization. Please note that downloading is currently not supprted on Safari browser, please use Firefox or Chrome.

## How to report bugs or offer suggestions?

Please open issues with prefix `BUG:` for bugs and `SUGGESTIONS:` for suggestions. If you can, mention format of your chat file as well as your country, OS, any other information you can afford to share.

## Testing

This is still being worked on. Please check later.

## Documentation for developers

This is still being worked on. Please check later.

## License

GPLv3
