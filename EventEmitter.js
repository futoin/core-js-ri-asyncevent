'use strict';

/**
 * @file
 *
 * Copyright 2017 FutoIn Project (https://futoin.org)
 * Copyright 2017 Andrey Galkin <andrey@futoin.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const scheduleCall = (
    ( ( typeof setImmediate !== 'undefined' ) && setImmediate ) ||
    ( ( c ) => setTimeout( c, 0 ) )
);
const SYM_EVENT_EMITTER = Symbol( 'FutoIn Event Emitter' );
const ON_PREFIX = '_evt_';
const ONCE_PREFIX = '_evtonce_';

/**
 * Asynchronous Event Emitter.
 *
 * @note Please avoid inheritting it, use EventEmitter.attach() instead!
 */
class EventEmitter {
    constructor( allowed_events, max_listeners ) {
        this._max = max_listeners;

        for ( let evt of allowed_events ) {
            this[`${ON_PREFIX}${evt}`] = [];
            this[`${ONCE_PREFIX}${evt}`] = [];
        }
    }

    /**
     * Attach event handler.
     * @param {string} evt - preconfigured event name
     * @param {callable} handler - async event handler
     */
    on( evt, handler ) {
        try {
            const hlist = this[`${ON_PREFIX}${evt}`];

            if ( hlist.length === this._max ) {
                // eslint-disable-next-line no-console
                console.warn( `Hitting max handler limit for: ${evt}` );
            }

            hlist.push( handler );
        } catch ( e ) {
            throw new Error( `Unknown event: ${evt}` );
        }
    }

    /**
     * Attach once-only event handler.
     * @param {string} evt - preconfigured event name
     * @param {callable} handler - async event handler
     */
    once( evt, handler ) {
        try {
            const hlist = this[`${ONCE_PREFIX}${evt}`];

            if ( hlist.length === this._max ) {
                // eslint-disable-next-line no-console
                console.warn( `Hitting max once handler limit for: ${evt}` );
            }

            hlist.push( handler );
        } catch ( e ) {
            throw new Error( `Unknown event: ${evt}` );
        }
    }

    /**
     * Remove event handler.
     * @param {string} evt - preconfigured event name
     * @param {callable} handler - async event handler
     */
    off( evt, handler ) {
        try {
            const memb = `${ON_PREFIX}${evt}`;
            this[memb] = this[memb].filter( ( h ) => h !== handler );

            const memb_once = `${ONCE_PREFIX}${evt}`;
            this[memb_once] = this[memb_once].filter( ( h ) => h !== handler );
        } catch ( e ) {
            throw new Error( `Unknown event: ${evt}` );
        }
    }

    /**
     * Emit async event.
     * @param {string} evt - event name
     */
    emit( evt, ...args ) {
        try {
            // ---
            for ( let h of this[`${ON_PREFIX}${evt}`] ) {
                // let runtime deal with exceptions
                scheduleCall( () => h( ...args ) );
            }

            // ---
            const once_list = this[`${ONCE_PREFIX}${evt}`];

            if ( once_list.length > 0 ) {
                for ( let h of once_list ) {
                    // let runtime deal with exceptions
                    scheduleCall( () => h( ...args ) );
                }

                this[`${ONCE_PREFIX}${evt}`] = [];
            }
        } catch ( e ) {
            throw new Error( `Unknown event: ${evt}` );
        }
    }

    static get SYM_EVENT_EMITTER() {
        return SYM_EVENT_EMITTER;
    }

    static [Symbol.hasInstance]( instance ) {
        return instance[SYM_EVENT_EMITTER] !== undefined;
    }

    /**
     * Attach event emitter to any instance
     * @param {object} instance - target object
     * @param {array} allowed_events - list of allowed event names
     * @param {integer} max_listeners=8 - maximum allowed handlers per event name
     */
    static attach( instance, allowed_events, max_listeners=8 ) {
        if ( instance[SYM_EVENT_EMITTER] !== undefined ) {
            throw new Error( 'Already attached' );
        }

        const ee = new EventEmitter( allowed_events, max_listeners );

        Object.defineProperties(
            instance,
            {
                [SYM_EVENT_EMITTER]: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: ee,
                },
                on: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: ( evt, handler ) => ee.on( evt, handler ),
                },
                off: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: ( evt, handler ) => ee.off( evt, handler ),
                },
                once: {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: ( evt, handler ) => ee.once( evt, handler ),
                },
                emit:  {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: ( evt, ...args ) => ee.emit( evt, ...args ),
                },
            }
        );
    }

    /**
     * Dynamically update max listener count
     * @param {object} instance - target object
     * @param {integer} max_listeners - maximum allowed handlers per event name
     */
    static setMaxListeners( instance, max_listeners ) {
        instance[SYM_EVENT_EMITTER]._max = max_listeners;
    }
}

module.exports = EventEmitter;
