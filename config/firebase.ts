/**
 * Config source: https://git.io/JBt3o
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env         from "@ioc:Adonis/Core/Env";
import Application from "@ioc:Adonis/Core/Application";
import path        from "path";

type FirebaseConfig = {
    keyFile: string,
    projectId: string,
    web: any
}

/*
|--------------------------------------------------------------------------
| Firebase Config
|--------------------------------------------------------------------------
|
*/
const firebaseConfig: FirebaseConfig = {
    keyFile  : path.resolve(Application.appRoot, Env.get("FIREBASE_KEY_FILE")),
    projectId: Env.get("FIREBASE_PROJECT_ID"),
    web      : {
        apiKey           : Env.get("FIREBASE_WEB_APIKEY"),
        authDomain       : Env.get("FIREBASE_WEB_AUTHDOMAIN"),
        projectId        : Env.get("FIREBASE_WEB_PROJECTID"),
        storageBucket    : Env.get("FIREBASE_WEB_STORAGEBUCKET"),
        messagingSenderId: Env.get("FIREBASE_WEB_MESSAGINGSENDERID"),
        appId            : Env.get("FIREBASE_WEB_APPID"),
    }
}

export default firebaseConfig
