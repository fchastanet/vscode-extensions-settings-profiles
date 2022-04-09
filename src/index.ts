import * as vscode from 'vscode';

import { activeProfilesSetupCommand, activateProfileCommand, startupCheck } from "./actions";
import { getConfig } from './configUtils';
import { CommandType } from "./types";
import { Environment } from './environment';

const MS_STARTUP_CHECK_DELAY = 250;

export function activate(context: vscode.ExtensionContext) {
	const environment = new Environment(context);
	
	context.subscriptions.push(
		vscode.commands.registerCommand(
			"extensions-settings-profiles.active-profiles-setup" as CommandType, 
			activeProfilesSetupCommand
		),
		vscode.commands.registerCommand(
			"extensions-settings-profiles.activate-profile" as CommandType, 
			activateProfileCommand
		)
	);

	const config = getConfig();
	if (config.enableStartupCheck) {
		setTimeout(() => {startupCheck(config);}, MS_STARTUP_CHECK_DELAY);
	}
}


