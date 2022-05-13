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
    private readonly _storage: Storage;
    private readonly _storageBucket: Bucket;

    constructor({ projectId, keyFilename }: FirebaseConstructor) {
        this._db = new Firestore({
            projectId  : projectId,
            keyFilename: keyFilename,
        });

        this._storage = new Storage({
            projectId  : projectId,
            keyFilename: keyFilename,
        });

        console.log("")

        this._storageBucket = this._storage.bucket(`${projectId}.appspot.com`);
    }

    get db(): FirebaseFirestore.Firestore {
        return this._db;
    }

    get storage(): Storage {
        return this._storage;
    }

    get storageBucket(): Bucket {
        return this._storageBucket;
    }
}

