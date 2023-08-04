import { defineCommands } from "myclt/functions/helpers";
import { errorAndExit, success } from "myclt/functions/loggers";
import jsonbank from "./backup/jsonbank";
import * as fs from "fs";

export default defineCommands({
    set({ command, store, args }) {
        if (args.length < 2) {
            return errorAndExit(`${command}: key and value are required!`);
        }

        const [key, value] = args;

        store.set(key, value);
        store.commitChanges();

        success(`${key} ==> ${value}`);
    },

    get({ command, store, args }) {
        if (args.length < 1) {
            return errorAndExit(`${command}: key is required!`);
        }

        const [key] = args;

        if (!store.has(key)) {
            return errorAndExit(`${command}: key ${key} not found!`);
        }

        const value = store.get(key);
        console.log(value);
    },

    has({ command, store, args }) {
        if (args.length < 1) {
            return errorAndExit(`${command}: key is required!`);
        }

        const [key] = args;
        console.log(store.has(key));
    },

    unset({ command, store, args }) {
        if (args.length < 1) {
            return errorAndExit(`${command}: key is required!`);
        }

        const [key] = args;

        if (!store.has(key)) {
            return errorAndExit(`${command}: key ${key} not found!`);
        }

        store.unset(key);
        store.commitChanges();

        success(`Unset: ${key}!`);
    },

    /**
     * Show json value of store or write to file if file is provided
     * @param file
     */
    json({ args: [filePath], store }) {
        const data = store.collection().all();

        if (filePath) {
            if (!filePath.endsWith(".json")) filePath += ".json";

            // write to file
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            success(`Written to file: ${filePath}`);
        } else {
            console.dir(data, { depth: null });
        }
    },

    backup: { jsonbank: jsonbank.Backup },
    restore: { jsonbank: jsonbank.Restore }
});
