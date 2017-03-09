import {ContainerModule} from "inversify";
import {ExpressContribution} from "../../application/node";
import {FileSystem, Path} from "../common";
import {FileSystemServer} from "../common/messaging";
import {NodeFileSystem} from "./node-fs";
import {ConnectionHandler} from "../../messaging/common";

export const ROOT_DIR_OPTION = '--root-dir=';

export const fileSystemServerModule = new ContainerModule(bind => {
    const rootDir = getRootDir();
    if (rootDir) {
        const fileSystem = new NodeFileSystem(Path.fromString(rootDir));
        bind<FileSystem>(FileSystem).toConstantValue(fileSystem);
        bind<ExpressContribution>(ConnectionHandler).to(FileSystemServer);
    } else {
        throw new Error(`The directory is unknown, please use '${ROOT_DIR_OPTION}' option`);
    }
});

export function getRootDir(): string | undefined {
    const arg = process.argv.filter(arg => arg.startsWith(ROOT_DIR_OPTION))[0];
    return arg ? arg.substring(ROOT_DIR_OPTION.length) : undefined;
}
