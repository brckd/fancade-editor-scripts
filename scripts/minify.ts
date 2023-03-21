import { minify } from "terser";
import { readdir, readFile, stat, writeFile } from "fs/promises";
import { program } from "@commander-js/extra-typings";
import { resolve, relative } from "path";

program
  .argument("input")
  .option("-c, --compress")
  .option("-m, --mangle")
  .option("-o, --output <dir>")
  .action(async (input, { compress, mangle, output }) => {
    const root = process.env.INIT_CWD ?? process.cwd();
    const inpDir = resolve(root, input)
    const outDir = resolve(root, output ?? input)
    for await (const file of walk(input)) {
        const inp = await readFile(file, "utf-8")
        const mini = await minify(inp, {compress, mangle})
        if (!mini.code) continue
        const out = resolve(outDir, relative(inpDir, file)).replace(".", ".min.")
        await writeFile(out, mini.code, "utf-8")
    }
  })
  .parseAsync()
  .catch(console.error);

export async function* walk(path: string): AsyncIterableIterator<string> {
  if ((await stat(path)).isDirectory())
    for (const item of await readdir(path)) yield* walk(resolve(path, item));
  else if (!path.includes(".min.")) yield path;
}
