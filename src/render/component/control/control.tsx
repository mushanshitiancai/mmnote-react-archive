import * as React from 'react';
import './control.less';

export function Welcome({actions, onClick}: { actions: { label: string, command: string }[], onClick: (action: string) => void }) {
    return <div className="welcome-container">
        <div className="welcome-content">
            {actions && actions.map((action, index) =>
                <a className="welcome-content-item" href="#" key={index} onClick={() => onClick(action.command)}>{action.label}</a>
            )}
        </div>
    </div>
}