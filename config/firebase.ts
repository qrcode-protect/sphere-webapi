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
}

export default firebaseConfig
