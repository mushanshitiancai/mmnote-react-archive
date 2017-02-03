import { editorUpdateAction } from '../action/action';
import { getCurrentDocument, RootStateType } from '../store/state';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Editor, EditorProps } from '../component/editor/editor';

export const EditorContainer = connect(
    function (state: RootStateType): EditorProps {
        let currentDoc = getCurrentDocument(state);

        return {
            options: state.getIn(['editor', 'options']).toJS(),
            url: currentDoc ? currentDoc.get('path') : undefined,
            content: currentDoc ? currentDoc.get('data') : undefined
        }
    }, function (dispatch): EditorProps {
        return bindActionCreators({
            onChange: editorUpdateAction
        },dispatch);
    }
)(Editor);
