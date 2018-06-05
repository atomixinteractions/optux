/* eslint-disable react/prefer-stateless-function, react/no-multi-comp */
/* eslint-disable react/require-default-props, react/no-unused-prop-types, react/sort-comp */
import React, { Component } from 'react'
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

const noop = () => {}

export const withOptice = (mapLenses, bindCommands, mapStateToProps) => (WrappedComponent) => {
  class Optux extends Component {
      static contextTypes = {
        [storeKey]: storeShape,
      };

      constructor(props, context) {
        super(props, context)

        this.store = context[storeKey]
        this.version = 0
        this.unsubscribe = noop
        this.commands = {}
        this.lensesValues = {}
        this.extraProps = {}

        if (!this.store) {
          throw new TypeError('No store in context! Use OptuxProvider')
        }

        this.initCommands()
        this.readLenses()
        this.readExtraProps()
      }

      initCommands() {
        if (!bindCommands) {
          this.commands = {}
          return
        }

        this.commands = Object.keys(bindCommands).reduce((all, name) => {
          // eslint-disable-next-line no-param-reassign
          all[name] = this.store.execute.bind(null, bindCommands[name])
          return all
        }, {})
      }

      readLenses() {
        if (!mapLenses) {
          this.lensesValues = {}
          return
        }

        this.lensesValues = Object.keys(mapLenses).reduce((all, name) => {
          // eslint-disable-next-line no-param-reassign
          all[name] = this.store.readState(mapLenses[name])
          return all
        }, {})
      }

      readExtraProps(props) {
        if (!mapStateToProps) {
          this.extraProps = {}
          return
        }

        if (typeof mapStateToProps === 'function') {
          this.extraProps = mapStateToProps(
            this.store.getState(),
            props || this.props,
          )
        }
        else {
          this.extraProps = mapStateToProps
        }
      }

      componentDidMount() {
        this.subscribeToStore()
      }

      shouldComponentUpdate(nextProps) {
        this.readExtraProps(nextProps)
        return true
      }

      componentWillUnmount() {
        this.unsubscribe()
        this.unsubscribe = noop
      }

      handleUpdates = () => {
        this.readLenses()
        this.readExtraProps()
        this.forceUpdate()
      };

      subscribeToStore() {
        this.unsubscribe = this.store.subscribe(this.handleUpdates)
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...this.lensesValues}
            {...this.commands}
            {...this.extraProps}
          />
        )
      }
  }

  return Optux
}
/** @see https://codesandbox.io/s/x36l72v68q */
