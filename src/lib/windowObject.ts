import { VendettaObject } from "@types";
import patcher from "@lib/patcher";
import logger from "@lib/logger";
import settings, { loaderConfig } from "@lib/settings";
import * as constants from "@lib/constants";
import * as debug from "@lib/debug";
import * as plugins from "@lib/plugins";
import * as themes from "@lib/themes";
import * as commands from "@lib/commands";
import * as storage from "@lib/storage";
import * as metro from "@metro/filters";
import * as common from "@metro/common";
import * as components from "@ui/components";
import * as toasts from "@ui/toasts";
import * as alerts from "@ui/alerts";
import * as assets from "@ui/assets";
import * as color from "@ui/color";
import * as utils from "@utils";

function without<T extends Record<string, any>>(object: T, ...keys: string[]) {
    const cloned = { ...object };
    keys.forEach((k) => delete cloned[k]);
    return cloned;
}

export default async (unloads: any[]): Promise<VendettaObject> => ({
    patcher: without(patcher, "unpatchAll"),
    metro: { ...metro, common: { ...common } },
    constants,
    utils,
    debug: without(debug, "versionHash", "patchLogHook"),
    ui: {
        components,
        toasts,
        alerts,
        assets,
        ...color,
    },
    plugins: without(plugins, "initPlugins"),
    themes: without(themes, "initThemes"),
    commands: without(commands, "patchCommands"),
    storage,
    settings,
    loader: {
        identity: window.__vendetta_loader,
        config: loaderConfig,
    },
    logger,
    version: debug.versionHash,
    unload: () => {
        unloads.filter(i => typeof i === "function").forEach(p => p());
        // @ts-expect-error explode
        delete window.vendetta;
    }
});
