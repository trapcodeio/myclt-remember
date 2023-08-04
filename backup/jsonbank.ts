import { defineCommand } from "myclt/functions/helpers";
import { Q } from "semantic-inquirer";
import { JsonBank } from "jsonbank";

/**
 * Initialize jsonbank
 */
async function initializeJsonBank() {
    // ask for the private key.
    const publicKey = await Q.ask(`Enter your Public key:`);
    const privateKey = await Q.ask(`Enter your Private key:`, {
        type: `password`
    });

    // initialize jsonbank
    return new JsonBank({
        keys: {
            pub: publicKey,
            prv: privateKey
        }
    });
}

/**
 * Backup remember store to jsonbank
 */
const Backup = defineCommand(async ({ store, args: [project], log }) => {
    // initialize jsonbank
    const jsb = await initializeJsonBank();

    // check if the project is set
    if (!project) {
        project = await Q.ask(`Enter the project name:`, { type: `input` });
    }

    const data = store.collection().all();

    try {
        const doc = await jsb.createDocumentIfNotExists({
            name: `myclt-remember`,
            content: data,
            project
        });

        if (doc.exists) {
            // update the document
            await jsb.updateOwnDocument(doc.id, data);
        }

        log.success(`Backup successful!`);
        log.info(`Project: ${project}`);
        log.info(`Document ID: ${doc.id}`);
        log.info(`Document Path: ${doc.path}`);
    } catch (error: any) {
        log.error(`Backup failed!`);
        log.error(error.message);
    }
});

/**
 * Restore remember store from jsonbank
 */
const Restore = defineCommand(async ({ log, store, args: [project] }) => {
    // initialize jsonbank
    const jsb = await initializeJsonBank();

    // check if project is set
    if (!project) {
        project = await Q.ask(`Enter the project name:`, { type: `input` });
    }

    try {
        const file = await jsb.getOwnDocumentMeta(project + `/myclt-remember`);
        const content = await jsb.getOwnContent(file.id);

        store.clear();
        store.set(content);
        store.commitChanges();

        log.success(`Restore successful!`);
        log.info(`Project: ${file.project}`);
        log.info(`Document ID: ${file.id}`);
        log.info(`Document Path: ${file.path}`);
    } catch (error: any) {
        log.error(`Restore failed!`);
        log.error(error.message);
    }
});

export default { Backup, Restore };
