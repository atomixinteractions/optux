/* eslint-disable react/prefer-stateless-function, react/no-multi-comp, react/require-default-props, react/no-unused-prop-types, react/sort-comp */
import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'


export const storeShape = PropTypes.shape({
  execute: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  readState: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
})
const storeKey = '@@optux_store'

export class OptuxProvider extends Component {
  static childContextTypes = {
    [storeKey]: storeShape.isRequired,
  };

  static propTypes = {
    store: storeShape.isRequired,
    children: PropTypes.element.isRequired,
  };

  constructor(props, context) {
    super(props, context)
    this[storeKey] = props.store
  }

  getChildContext() {
    return {
      [storeKey]: this[storeKey],
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

const noop = () => { }

export const withOptice = (lenses, commands) => (WrappedComponent) => {
  class Optux extends Component {
      static contextTypes = {
        [storeKey]: storeShape,
      };

      constructor(props, context) {
        super(props, context)

        this.store = context[storeKey]
        this.state = {}
        this.version = 0
        this.unsubscribe = noop
        this.commands = {}

        if (!this.store) {
          throw new TypeError('No store in context! Use OptuxProvider')
        }

        this.state = { store: this.store.getState() }

        this.initCommands()
        this.initSelector()
      }

      initCommands() {
        this.commands = Object.keys(commands).reduce((all, name) => {
          all[name] = this.store.execute.bind(null, commands[name])
          return all
        }, {})
      }

      initSelector() {
        console.info('Write selector')
      }

      componentDidMount() {
        this.subscribeToStore()
      }

      componentWillUnmount() {
        this.unsubscribe()
        this.unsubscribe = noop
      }

      handleUpdates = (state) => {
        this.setState({ store: state })
      };

      subscribeToStore() {
        this.unsubscribe = this.store.subscribe(this.handleUpdates)
      }

      render() {
        return (
          <WrappedComponent
            {...this.state.store}
            {...this.commands}
            {...this.props}
          />
        )
      }
  }

  return Optux
}

/** @see https://codesandbox.io/s/x36l72v68q */
