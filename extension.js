const vscode = require('vscode');
const client = require('discord-rich-presence')('876781021448769566');

const startTimestamp = Date.now()
var currentWorkspaceName = undefined;
const imageKey = {
	"py": "python",
	"rs": "rust",
	"ts": "ts",
	"js": "js",
	"java": "java",
	"json": "json",
	"c": "c",
	"cp": "c_",
	"cpp": "c__"
};

function getFileName(path) {
	const split_str = path.split(`\\`);
	return split_str[split_str.length - 1];
}

function getFileNameExt(fileName) {
	const splitFileName = fileName.split(".");
	return splitFileName[splitFileName.length - 1];
}

function onFileOpened(event) {
	console.log(event);
	if (event == undefined) {
		var data = {
			details: currentWorkspaceName ? currentWorkspaceName != undefined : '',
			state: 'Idle',
			startTimestamp: startTimestamp,
			largeImageKey: 'vscode_dark',
			instance: true,
		};
		if (currentWorkspaceName != undefined) {
			data["details"] = currentWorkspaceName;
		}
		client.updatePresence(data);
		return;
	}

	const fileName = getFileName(event.document.fileName);
	const ext = getFileNameExt(fileName);
	var data = {
		state: "In " + fileName,
		startTimestamp: startTimestamp,
		largeImageKey: 'vscode_dark',
		smallImageKey: imageKey[ext],
		instance: true,
	};
	if (currentWorkspaceName != undefined) {
		data["details"] = currentWorkspaceName;
	}
	client.updatePresence(data);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('live-discord-code is active');

	currentWorkspaceName = vscode.workspace.name;

	var state = 'Idle';
	if (vscode.window.activeTextEditor != undefined) {
		var fileName = getFileName(vscode.window.activeTextEditor.document.fileName)
		state = fileName;
	}

	var data = {}

	if (currentWorkspaceName == undefined) {
		data = {
			details: '',
			state: state,
			startTimestamp: startTimestamp,
			largeImageKey: 'vscode_dark',
			instance: true,
		};
	} else {
		data = {
			details: currentWorkspaceName,
			state: state,
			startTimestamp: startTimestamp,
			largeImageKey: 'vscode_dark',
			instance: true,
		};
	}

	if (state != 'Idle') {
		data['smallImageKey'] = imageKey[getFileNameExt(fileName)];
	}
	client.updatePresence(data);

	vscode.window.onDidChangeActiveTextEditor(onFileOpened);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('live-discord-code.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Live Discord Code!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
