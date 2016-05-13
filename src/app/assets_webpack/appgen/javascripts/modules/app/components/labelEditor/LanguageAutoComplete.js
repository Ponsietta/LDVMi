import React from 'react'
import { fromJS } from 'immutable'
import AutoComplete from '../../../../../../../../node_modules/material-ui/lib/auto-complete'
import MenuItem from '../../../../../../../../node_modules/material-ui/lib/menus/menu-item'
import languages from '../../../../misc/languages'

const dataSource = fromJS(languages).map((language, code) => ({
  text: code,
  value: <MenuItem primaryText={language} />
})).toList().toJS();

/**
 * @param searchText searched by the user
 * @param code language code we're comparing the searchText to
 * @returns boolean
 */
const filter = (searchText, code) => {
  // Substring based comparison against both the code and the language name. This way the
  // user can search language name and he will get a proper code in return.
  return searchText && searchText.length > 1 &&
    (code.includes(searchText) || languages[code].toLowerCase().includes(searchText.toLowerCase()));
};

const LanguageAutoComplete = props => {
  // The autocomplete is not really compatible with the API of standard text input.
  // Therefore we need to bind autocomplete events to those expected from a standard text input.
  return <AutoComplete
    filter={filter}
    dataSource={dataSource}
    searchText={props.value}
    onNewRequest={props.onChange}
    onUpdateInput={props.onChange}
    menuCloseDelay={200}
    {...props}
  />
};

export default LanguageAutoComplete;
