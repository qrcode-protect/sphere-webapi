"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 10:54
 * File src/Article/Article
 */

import Model             from "QRCP/Sphere/Common/Model";
import ArticleAttributes from "QRCP/Sphere/_Article/Article/ArticleAttributes";
import { each }          from "lodash";
import ArticleParagraph  from "QRCP/Sphere/_Article/ArticleParagraph/ArticleParagraph";

export default class Article extends Model {
    id?: string
    writer?: string
    image?: string
    themes?: string[]
    title?: string
    paragraphs: any[]
    networks: string[]

    constructor(attributes?: ArticleAttributes) {
        super({ collectionName: "articles", model: Article });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
        /*if (this.paragraphs)
            for (let i = 0; i < this.paragraphs.length; i++) {
                this.paragraphs[i] = new ArticleParagraph(this.paragraphs[i])
            }*/
    }

    public async findByNetworkId(networks?: string): Promise<any> {
        // const snapshot: QuerySnapshot = (await this.collection.where("networks", "==", networks ?? null).orderBy("createdAt", "desc").get());

        // if (snapshot.empty) {
        //     return null;
        // }

        // const result: any = []
        //
        // forEach(snapshot.docs, async item => {
        //     return result.push(await this.casting(item.data()));
        // })
        // return result

        // return await Promise.all( snapshot.docs.map(async (doc: QueryDocumentSnapshot<DocumentData>) => {
        //     return await this.casting(doc.data());
        // }))

        // console.log(await articles)
        // return await this.collection.doc('8D05P4c9KMDZeR1H3OZX').get()
        return (await (networks ? this.whereSnapshot("networks", networks, "array-contains") : this).orderBy("createdAt", "desc").get()) ?? [];
    }

    async casting(data): Promise<any> {
        const documentsRefs = await this.collection.doc(data.id).collection("paragraphs").listDocuments();

        const paragraphs: any[] = [];
        for (const documentSnapshot of documentsRefs) {
            paragraphs.push(await (new ArticleParagraph()).casting((await documentSnapshot.get()).data()));
        }

        const articleData = { ...data, paragraphs }

        return super.casting(articleData);
    }

    async store(data: ArticleAttributes): Promise<any> {

        const batch = this.instance.batch()

        const article = this.collection.doc()

        if (typeof data.networks === "undefined" || !data.networks || data.networks.length === 0)
            data.networks = null

        batch.set(article, {
            id       : article.id,
            writer   : data.writer,
            image    : data.image,
            title    : data.title,
            themes   : data.themes,
            networks : data.networks ?? null,
            createdAt: Model._now(),
            updatedAt: Model._now(),
        })

        each(data.paragraphs, item => {
            const paragraph = article.collection("paragraphs").doc()
            batch.set(paragraph, {
                content: item.content,
                title  : item.title,
                id     : paragraph.id
            })
        })

        await batch.commit()

        return await this.casting((await (await this.collection.doc(article.id)).get()).data());
    }

    async update(docID: string, updatable: ArticleAttributes): Promise<any> {

        if (docID.trim() === "")
            return null;

        const batch = this.instance.batch()

        const article = this.collection.doc(docID)

        if (typeof updatable.networks === "undefined" || (updatable.networks && updatable.networks.length === 0))
            updatable.networks = null

        const paragraphs = updatable.paragraphs
        delete updatable.paragraphs
        delete updatable.createdAt

        batch.set(article, { ...updatable, ...{ updatedAt: Model._now() } })

        each(paragraphs, item => {
            const paragraph = item.id ? article.collection("paragraphs").doc(item.id) : article.collection("paragraphs").doc()
            batch.set(paragraph, {
                content: item.content,
                title  : item.title,
                id     : paragraph.id
            })
        })

        await batch.commit()

        return await this.casting((await (await this.collection.doc(article.id)).get()).data());
    }
}
