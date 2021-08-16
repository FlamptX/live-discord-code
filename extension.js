const vscode = require('vscode');
const client = require('discord-rich-presence')('876781021448769566');
const startTimestamp = Date.now()
var currentWorkspaceName = undefined;

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
	var split_str = event.document.fileName.split(`\\`);
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
	const fileName = split_str[split_str.length - 1];
	const splitFileName = fileName.split(".");
	const ext = splitFileName[splitFileName.length - 1];
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
	if (currentWorkspaceName == undefined) {
		client.updatePresence({
			details: '',
			state: 'Idle',
			startTimestamp: startTimestamp,
			largeImageKey: 'vscode_dark',
			instance: true,
		});
	} else {
		client.updatePresence({
			details: currentWorkspaceName,
			state: 'Idle',
			startTimestamp: startTimestamp,
			largeImageKey: 'vscode_dark',
			instance: true,
		});
	}
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
