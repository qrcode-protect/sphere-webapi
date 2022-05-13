"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 04/05/2022 at 11:00
 * File app/Firebase
 */

import { Firestore }       from "@google-cloud/firestore";
import { Bucket, Storage } from "@google-cloud/storage";

interface FirebaseConstructor {
    projectId: string;
    keyFilename: string;
}

export default class Firebase {
    private readonly _db: Firestore;
    private readonly _storage;

    constructor({ projectId, keyFilename }: FirebaseConstructor) {
        this._db = new Firestore({
            projectId  : projectId,
            keyFilename: keyFilename,
        });

        this._storage = new Storage({
            projectId  : projectId,
            keyFilename: keyFilename,
        }).bucket(`${projectId}.appspot.com`);
    }

    get db(): FirebaseFirestore.Firestore {
        return this._db;
    }

    get storage(): Bucket {
        return this._storage;
    }
}

