<p align="center">
 <img src="https://i.imgur.com/4cdl3gV.png" alt="banner">
</p>

## Présentation

Pour notre projet de terminale STI2D nous avons décidé de faire une imprimante braille qui sera contrôlé à distance grâce à un téléphone, nous pourrons écrire grâce à un clavier ou à la voix. Le texte étant écrit, il suffira alors de toucher le bouton "Imprimer" et d'approcher votre téléphone de l'imprimante pour qu'elle imprime votre message en braille. Ou alors par Wi-Fi ou Bluetooth.

## Aperçu du projet
![Project Overview](https://i.imgur.com/YjKTDR4.gif "Project Overview")

## Comment reproduire le projet ?

* Installer [Git](https://git-scm.com/)
* `git clone https://github.com/dream-io/braille-embosser.git` Cloner ce repository
* Télécharger [NodeJS](https://nodejs.org/en/) > 8.9.x et inclure [NPM](https://www.npmjs.com/) (Node Package Manager)
* Télécharger [Android Studio](https://developer.android.com/studio/index.html) (AVD) pour émuler un appareil Android. (Voir la [documentation de React Native](https://facebook.github.io/react-native/docs/getting-started.html) pour installer Android Studio avec les bonnes dépendances)
* Lancer le serveur :
  * `cd Server`
  * `npm install` Téléchargement des dépendances
  * `node server` Pour lancer le serveur pour l'app
* Lancer l'application :
  * Lancer une émulation Android ou brancher votre téléphone par USB en activant `USB debugging` dans `Developper options`
  * `cd App` être au niveau de /App/
  * `npm install` Téléchargement des dépendances
  * `react-native run-android` Pour lancer le packager de React Native
* Lancer le site : 
  * `cd Website` être au niveau de /Website/
  * `npm run start` Sert le serveur ReactJS et ouvre la page Web

## Fonctionnalités

  * **Android/IOS Device**
    * [x] Envoyer le texte à imprimer au Raspberry Pi.
    * [ ] Pouvoir écrire grâce à une reconnaissance vocale.
    * [ ] Communiquer avec le Raspberry Pi via NFC, Wi-Fi et Bluetooth.
  * **Raspberry Pi 3 B+**
    * [x] Serveur Web
    * [x] Encode le texte entré par l'utilisateur en code braille.
    * [x] Envoie le code braille à l'Arduino Uno.
    * [ ] Gère les [status](https://github.com/dream-io/braille-embosser/wiki/Documentation#messages-status-statusjson) que l'Arduino Uno pourraient renvoyer.

  * **Arduino Uno**
    * [ ] Déforme la feuille pour les 6 cellules brailles.
    * [x] Fait avancer le papier.
    * [ ] Détecte s'il n'y a plus de papier.
    
## [Click here to read the Wiki](https://github.com/dream-io/braille-embosser/wiki)
#### [And the Documentation for further informations](https://github.com/dream-io/braille-embosser/wiki/Documentation)

## Contributeurs
* `/App/` et `/Server/` sont développés par [KeziahMoselle](https://github.com/KeziahMoselle)
* `/Arduino/` est développé par [YannSeget](https://github.com/YannSeget).
