<p align="center">
 <img src="https://i.imgur.com/4cdl3gV.png" alt="banner">
</p>

## Project tree

### Folders

*  `App` : Pure React Native App
*  `Server` : Raspberry Pi NodeJS Server
*  `Website` : ReactJS Website alternative to the App

## Installing

### Prerequisites
* Install [NodeJS](https://nodejs.org/en/) 8 or higher
* Download [Android Studio](https://developer.android.com/studio/index.html) for AVD. (See [React Native Documentation](https://facebook.github.io/react-native/docs/getting-started.html) for further informations)

* `git clone https://github.com/KeziahMoselle/braille-embosser.git`
* Launch the Server :
  * `cd Server`
  * `npm install`
  * `node server`
* Launch the App :
  * Launch AVD or plug your smartphone and enable : `USB debugging` in `Developper options`
  * `cd App`
  * `npm install`
  * `react-native run-android`
* Launch the Website : 
  * `cd Website`
  * `npm run start`

## Features

  * **Application**
    * [x] Envoyer le texte à imprimer au Raspberry Pi.
    * [x] Communiquer avec le Raspberry Pi via Wi-Fi.
    * ~~Voice recognition.~~
    * ~~NFC.~~
  * **Server**
    * [x] Web Server
    * [x] Encode user input in Braille code.
    * [x] Send the braille code the microcontroller.
    * [x] Error / Success handler
