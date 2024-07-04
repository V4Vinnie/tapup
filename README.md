# TapUp

## Description
TapUp is a micro-learning platform that offers next-gen educational content designed for fast consumption. 
This is Expo Dev Client and NOT Expo Go, so you need an Android Emulator that can be downloaded through Android Studio.

## Requirements
* Node
* NPM
* Firebase project
* Ask for permissions in Expo
* Java (select version 18 and select the right OS and bit)
    [Azul Download](https://www.azul.com/downloads/?version=java-16-sts&show-old-builds=true#zulu)

## Installation
1. Make an .env file and fill in the details of your Firebase project (.env.example is a template).
2. **(Windows)** Search for environment variables in search bar
     * Select "Environment variables"
     * Create a new variable called "JAVA_HOME" for both the *User* and *System* variables.
        * The value of these is the folder of you Azul installation folder, most likely it is the following: `C:\Program Files\Zulu\zulu-18`
    * Under *System variables* double click the value of the variable *Path*.
    * Click *New* and add the *bin subfolder* in the textfield, most likely `C:\Program Files\Zulu\zulu-18\bin`
    * Restart your CMD
    **(Apple)** // TODO (weet niet of er daar iets custom geïnstalleerd moet worden?)
3. In the root of the project install all dependencies using `npm install`
4. **(Windows)** Install an emulator through Android Studio
    * Run the command `npm run android`

Now the project should start, if not please look at the description below.

## Troubleshoot
1. `java -version` is not working
    * Restart your cmd / code editor and open your cmd again