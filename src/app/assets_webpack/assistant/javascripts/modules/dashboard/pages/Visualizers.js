import React, { PropTypes, Component } from 'react'
import { OrderedSet, List, Map } from 'immutable'
import { connect } from 'react-redux'
import { createSelector, createStructuredSelector } from 'reselect'
import Helmet from 'react-helmet'
import Padding from '../../../components/Padding'
import PromiseResult from '../../core/components/PromiseResult'
import Button from '../../../components/Button'
import PullRight from '../../../components/PullRight'
import CenteredMessage from '../../../components/CenteredMessage'
import ClearBoth from '../../../components/ClearBoth'
import { PromiseStatus } from '../../core/models'
import { createAggregatedPromiseStatusSelector } from '../../core/ducks/promises'
import { addVisualizer, updateVisualizer, visualizersSelector, visualizersStatusSelector } from '../../core/ducks/visualizers'
import { deleteVisualizer } from '../ducks/visualizers'
import { getVisualizerComponents, getVisualizerComponentsReset, visualizerComponentsSelector, visualizerComponentsStatusSelector } from '../ducks/visualizerComponents'
import { dialogOpen, dialogClose } from '../../core/ducks/dialog'
import AddVisualizerDialog, { dialogName as addVisualizerDialogName } from '../dialogs/AddVisualizerDialog'
import EditVisualizerDialog, { dialogName as  editVisualizerDialogName} from '../dialogs/EditVisualizerDialog'
import * as api from '../api'
import { notification } from '../../core/ducks/notifications'
import VisualizersTable from '../components/VisualizersTable'
import { editVisualizer, visualizerToEditSelector } from '../ducks/editVisualizer'
import { Visualizer } from '../../core/models'
import requireAdmin from '../../auth/containers/requireAdmin'
import { getRegisteredVisualizerNames } from '../../visualizers/routes'


class Visualizers extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    visualizers: PropTypes.instanceOf(List).isRequired,
    visualizerComponents: PropTypes.instanceOf(Map).isRequired,
    visualizerToEdit: PropTypes.instanceOf(Visualizer).isRequired,
    availableVisualizerNames: PropTypes.instanceOf(List).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getVisualizerComponents());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(getVisualizerComponentsReset());
  }

  editVisualizer(id) {
    const { dispatch } = this.props;
    dispatch(editVisualizer(id));
    dispatch(dialogOpen(editVisualizerDialogName));
  }

  deleteVisualizer(id) {
    const { dispatch } = this.props;
    dispatch(deleteVisualizer(id));
  }

  async handleAddVisualizer(values) {
    const { dispatch } = this.props;
    try {
      const visualizer = await api.addVisualizer(values.componentTemplateUri);
      dispatch(notification('The visualizer has been created'));
      dispatch(dialogClose(addVisualizerDialogName));
      dispatch(addVisualizer(visualizer));
    } catch (e) {
      const { message, data } = e;
      dispatch(notification(message));
      if (data) {
        throw data; // Errors for the form
      }
    }
  }
  
  async handleUpdateVisualizer(values) {
    const { dispatch, visualizerToEdit: { id } } = this.props;
    try {
      await api.updateVisualizer(id, values);
      dispatch(notification('The visualizer been saved'));
      dispatch(dialogClose(editVisualizerDialogName));
      dispatch(updateVisualizer(id, values));
    } catch (e) {
      const { message, data } = e;
      dispatch(notification(message));
      if (data) {
        throw data; // Errors for the form
      }
    }
  }

  render() {
    const { dispatch, visualizers, visualizerComponents, visualizerToEdit, availableVisualizerNames, status } = this.props;

    return (
      <div>
        <Helmet title="Visualizers" />

        {visualizers.size > 0 &&
          <VisualizersTable
            visualizers={visualizers}
            editVisualizer={::this.editVisualizer}
            deleteVisualizer={::this.deleteVisualizer}
          />}

        <EditVisualizerDialog
          onSubmit={::this.handleUpdateVisualizer}
          initialValues={visualizerToEdit.toJS()}
          availableVisualizerNames={availableVisualizerNames}
          dialogClose={() => dispatch(dialogClose(editVisualizerDialogName))}
        />
        
        <AddVisualizerDialog
          onSubmit={::this.handleAddVisualizer}
          visualizerComponents={visualizerComponents}
          dialogClose={() => dispatch(dialogClose(addVisualizerDialogName))}
        />

        <Padding space={2}>
          {visualizers.size == 0 && (
            <div>
              {status.done && <CenteredMessage>No visualizers found.</CenteredMessage>}
              <PromiseResult status={status} loadingMessage="Loading visualizers..."/>
            </div>
          )}

          {visualizerComponents.size > 0 && (
            <PullRight>
              <Button raised success
                label="Add visualizer"
                icon="add"
                onTouchTap={() => dispatch(dialogOpen(addVisualizerDialogName))}
              />
            </PullRight>
          )}
          <ClearBoth />
        </Padding>
      </div>
    );
  }
}

// The user is allowed to create only one visualizer for each LDVM visualizer component. So let's
// remove those components that are already used.
const unusedVisualizerComponentsSelector = createSelector(
  [visualizersSelector, visualizerComponentsSelector],
  (visualizers, visualizerComponents) =>
    visualizers.reduce((unused, visualizer) =>
      unused.delete(visualizer.componentTemplateId), visualizerComponents)
);

// A visualizer plugin is registered to the codebase under a "name". Using this name, a LDVM
// visualizer component is mapped to the corresponding plugin. This mapping is managed by the user.
// This selector returns the names of all registered visualizer plugins minus the ones that
// are already used.
const availableVisualizerNamesSelector = createSelector(
  [visualizersSelector, visualizerToEditSelector, getRegisteredVisualizerNames],
  (visualizers, visualizerToEdit, registeredNames) => {
    return visualizers.reduce((available, visualizer) =>
      available.delete(visualizer.name), new OrderedSet(registeredNames))
      .add(visualizerToEdit.name).toList();
  }
);

const selector = createStructuredSelector({
  visualizers: visualizersSelector,
  visualizerComponents: unusedVisualizerComponentsSelector,
  visualizerToEdit: visualizerToEditSelector,
  availableVisualizerNames: availableVisualizerNamesSelector,
  status: createAggregatedPromiseStatusSelector([
    visualizersStatusSelector,
    visualizerComponentsStatusSelector
  ])
});

export default requireAdmin(connect(selector)(Visualizers));
