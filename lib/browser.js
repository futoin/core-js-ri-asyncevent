/**
 * @file Browser-specific entry point
 * @author Andrey Galkin <andrey@futoin.org>
 *
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

( function( window ) {
    'use strict';

    var futoin = window.FutoIn || window.futoin || {};

    if ( typeof futoin.$asyncevent === 'undefined' )
    {
        var $asyncevent = require( './asyncevent.js' );

        /**
         * **window.$asyncevent** - browser-only reference to futoin-asyncsteps module
         * @global
         * @name window.$asyncevent
         */
        window.$asyncevent = $asyncevent;

        /**
         * **window.FutoIn.$asyncevent** - browser-only reference to futoin-asyncsteps module
         * @global
         * @name window.FutoIn.$asyncevent
         */
        futoin.$asyncevent = $asyncevent;

        /**
         * **window.futoin.EventEmitter** - browser-only reference to futoin-asyncsteps.EventEmitter
         * @global
         * @name window.futoin.EventEmitter
         */
        futoin.EventEmitter = $asyncevent.EventEmitter;

        window.FutoIn = futoin;
        window.futoin = futoin;
    }

    if ( typeof module !== 'undefined' ) {
        module.exports = futoin.$asyncevent;
    }
} )( window );
