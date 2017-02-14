import * as React from 'react';
import './control.less';

export function Welcome({actions,onClick}) {
    return <div className="welcome-container">
        <div className="welcome-content">
            <a className="welcome-content-item" href="#">Create NoteBook</a>
            <a className="welcome-content-item" href="#">Open Note</a>
        </div>
    </div>
}