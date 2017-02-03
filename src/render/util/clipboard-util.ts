import { clipboard } from 'electron';
import { spawn } from 'child_process'

import { FileUtil } from './file-util';
import { fsp } from './fs-promise';

export class ClipboardUtil {

    static saveImageToFile(path: string): Promise<void | boolean> {
        let img = clipboard.readImage();

        if (img && !img.isEmpty()) {
            if (process.platform == 'darwin') {
                return new Promise<void>((resolve, reject) => {
                    let ascript = spawn('osascript', ['-e', clipboardScript, path]);
                    ascript.on('exit', function (code, signal) {
                        // console.log('exit',code,signal);
                    });

                    ascript.stdout.on('data', function (data: Buffer) {
                        resolve();
                    });
                });

            } else {
                return fsp.writeFile(path, img.toPNG());
            }
        }

        return Promise.resolve(false);
    }

    static saveImageToFile2(path: string, clipboardEvent?: ClipboardEvent): Promise<void | boolean> {
        if (clipboardEvent && clipboardEvent.clipboardData && clipboardEvent.clipboardData.items) {
            let items = clipboardEvent.clipboardData.items
            if (items.length >= 1) {
                let item: DataTransferItem = items[0];

                if (item.kind === 'file') {
                    let blob = item.getAsFile();
                    return FileUtil.writeBlob(blob, path)
                }
            }
        } else {
            if (clipboard.readImage()) {
                let buffer = clipboard.readImage().toPNG()
                return fsp.writeFile(path, buffer);
            }
        }
        return Promise.resolve(false);
    }
}

const clipboardScript = `
property fileTypes : {{«class PNGf», ".png"}}

on run argv
	if argv is {} then
		return ""
	end if
	
	set imagePath to (item 1 of argv)
	set theType to getType()
	
	if theType is not missing value then		
		try
			set myFile to (open for access imagePath with write permission)
			set eof myFile to 0
			write (the clipboard as (first item of theType)) to myFile
			close access myFile
			return (POSIX path of imagePath)
		on error
			try
				close access myFile
			end try
			return ""
		end try
	else
		return "no image"
	end if
end run

on getType()
	repeat with aType in fileTypes
		repeat with theInfo in (clipboard info)
			if (first item of theInfo) is equal to (first item of aType) then return aType
		end repeat
	end repeat
	return missing value
end getType
`;