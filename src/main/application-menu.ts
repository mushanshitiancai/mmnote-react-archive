import { Window } from './window';
import { Application } from './application';
import { Menu, MenuItem, app } from 'electron';

export interface CommandMenuItemOptions extends Electron.MenuItemOptions {
    permanent?: boolean; // is extists when no window alibe
    platform?: 'darwin' | 'freebsd' | 'linux' | 'sunos' | 'win32';
    command?: string;
    parameters?: any;
    submenu?: CommandMenuItemOptions[];
}

const _template: CommandMenuItemOptions[] = [
    {
        "label": "MMNote",
        "submenu": [
            {
                "label": "About MMNote",
                "command": "about"
            },
            {
                type: 'separator'
            },
            {
                "label": "Edit Preferences",
                "accelerator": "CmdOrCtrl+,",
                "command": "editConfigFile",
            },
            {
                "label": "Open Config Directory",
                "command": "openConfigDir",
            },
            {
                "type": "separator"
            },
            {
                "label": "Hide MMNote",
                "role": "hide",
            },
            {
                "label": "Hide Others",
                "role": "hideothers",
            },
            {
                "label": "Show All",
                "role": "unhide",
            },
            {
                "type": "separator"
            },
            {
                "label": "Quit MMNote",
                "role": "quit",
            }
        ]
    },
    {
        "label": "&File",
        "submenu": [
            {
                "label": "New Note",
                "accelerator": "CmdOrCtrl+N",
                "command": "new",
            },
            {
                "label": "Open Note",
                "accelerator": "CmdOrCtrl+O",
                "command": "open"
            }, {
                "label": "Save",
                "accelerator": "CmdOrCtrl+S",
                "command": "save"
            },
            {
                "label": "Save As…",
                "accelerator": "CmdOrCtrl+Shift+S",
                "command": "saveAs"
            },
            {
                "type": "separator"
            },
        ]
    },
    {
        "label": "&Edit",
        "submenu": [
            {
                "label": "Undo",
                "accelerator": "CmdOrCtrl+Z",
                "role": "undo"
            },
            {
                "label": "Redo",
                "accelerator": "CmdOrCtrl+Y",
                "role": "redo"
            },
            {
                "type": "separator"
            },
            {
                "label": "Cut",
                "accelerator": "CmdOrCtrl+X",
                "role": "cut"
            },
            {
                "label": "Copy",
                "accelerator": "CmdOrCtrl+C",
                "role": "copy"
            },
            {
                "label": "Paste",
                "accelerator": "CmdOrCtrl+V",
                "role": "paste"
            },
            {
                "label": "Select All",
                "accelerator": "CmdOrCtrl+A",
                "role": "selectall"
            },
            {
                "type": "separator"
            }
        ]
    }
];

export class ApplicationMenu {
    template = Object.assign([], _template);

    constructor(application: Application) {
        // parse command menuitem options
        ApplicationMenu.parseTemplate(this.template, application);
    }

    private static parseTemplate(menuItems: CommandMenuItemOptions[], application: Application) {
        if (menuItems && menuItems instanceof Array) {
            for (let menuItem of menuItems) {
                if (menuItem.command) {
                    menuItem.click = function () {
                        application.execCommand(menuItem.command, menuItem.parameters);
                    }
                }

                if (menuItem.submenu) {
                    ApplicationMenu.parseTemplate(menuItem.submenu, application);
                }
            }
        }
    }

    attach() {
        Menu.setApplicationMenu(Menu.buildFromTemplate(this.template));
    }
}
