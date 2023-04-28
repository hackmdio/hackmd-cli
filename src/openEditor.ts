import { spawn, ChildProcess } from "child_process";

interface EditorOptions {
  editor?: string;
}

export function openEditor(
  file: string,
  opts: EditorOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const editor = getEditor(opts.editor);
    const args = editor.split(/\s+/);
    const bin = args.shift();

    if (!bin) {
      reject(new Error("Editor binary not found"));
      return;
    }

    console.debug(`Opening ${file} with ${bin} ${args.join(" ")}`);

    const ps: ChildProcess = spawn(bin, [...args, file], { stdio: "inherit" });

    ps.on("exit", (code: number, sig: NodeJS.Signals) => {
      resolve();
    });

    ps.on("error", (err: Error) => {
      reject(err);
    });
  });
}

function getEditor(editor?: string): string {
  return (
    editor || process.env.VISUAL || process.env.EDITOR || getDefaultEditor()
  );
}

function getDefaultEditor(): string {
  return /^win/.test(process.platform) ? "notepad" : "vim";
}

export default openEditor;
