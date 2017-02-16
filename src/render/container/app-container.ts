import { AppState, StateType } from '../redux/store/state';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Editor, EditorProps } from '../component/editor/editor';
import {IAppProps,App} from '../component/app/app';

export const AppContainer = connect(
    function (state: StateType): IAppProps {
        return {
            state: state
        }
    }, function (dispatch): IAppProps {
        return bindActionCreators({
            
        },dispatch);
    }
)(App);
