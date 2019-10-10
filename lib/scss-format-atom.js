const { CompositeDisposable } = require("atom");
const path = require("path");
const childProcess = require("child_process");
const fs = require("fs");

module.exports = {
    subscriptions: null,

    activate () {
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(
            atom.commands.add(
                "atom-workspace",
                {"scss-format-atom:format": () => this.formatFile()}
            )
        );

        this.subscriptions.add(atom.workspace.observeTextEditors(e => this.handleEvents(e)));
    },

    deactivate () {
        this.subscriptions.dispose();
    },

    handleEvents(editor) {
        editor.getBuffer().onWillSave(() => {
            const formatOnSave = true;
            if (formatOnSave && this.isScssEditor(editor)) {
                this.format(editor);
            }
        });
    },

    formatFile() {
        const editor = atom.workspace.getActiveTextEditor();

        if (this.isScssEditor(editor)) {
            this.format(editor);
        }
    },

    isScssEditor(editor) {
        return editor
            && editor.getPath
            && editor.getPath()
            && path.extname(editor.getPath()) === ".scss";
    },

    error(str, options = {}) {
        atom.notifications.addError(str, options);
    },

    success(str) {
        atom.notifications.addSuccess(str);
    },

    format(editor) {
        try {
            errorLineNum = null;
            const binary = "scss-format";

            const { status, stdout, stderr } = childProcess.spawnSync(
                binary,
                ["--stdin"], { input: editor.getText() }
            );

            switch (status) {
            case 0: {
                const cursorPosition = editor.getCursorScreenPosition();
                editor.buffer.setTextViaDiff(stdout.toString());
                editor.setCursorScreenPosition(cursorPosition);
                this.success("File Formatted");
                break;
            }
            case 1:
                this.error("Scss Format failed with 1");
                break;
            case null:
                this.error("Scss Format failed with null");
                break;
            default:
                this.error(`scss-format exited with code ${status}.`);
            }
        } catch (exception) {
            this.error(`scss-format exception: ${exception}`);
        }
    }
}
