import { editorUpdateAction } from '../redux/action/action';
import { AppState,StateType } from '../redux/store/state';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Editor, EditorProps } from '../component/editor/editor';

export const EditorContainer = connect(
    function (state: StateType): EditorProps {
        return {
            doc: AppState.docCursor(state).get()
        }
    }, function (dispatch): EditorProps {
        return bindActionCreators({
            onChange: editorUpdateAction
        },dispatch);
    }
)(Editor);
