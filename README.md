
  [![NPM Version](https://img.shields.io/npm/v/futoin-asyncevent.svg?style=flat)](https://www.npmjs.com/package/futoin-asyncevent)
  [![NPM Downloads](https://img.shields.io/npm/dm/futoin-asyncevent.svg?style=flat)](https://www.npmjs.com/package/futoin-asyncevent)
  [![Build Status](https://travis-ci.org/futoin/core-js-ri-asyncevent.svg)](https://travis-ci.org/futoin/core-js-ri-asyncevent)
  [![stable](https://img.shields.io/badge/stability-stable-green.svg?style=flat)](https://www.npmjs.com/package/futoin-asyncevent)

  [![NPM](https://nodei.co/npm/futoin-asyncevent.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/futoin-asyncevent/)

**Stability: 3 - Stable**
  
# About

Implementation of a well-known event emitter pattern, but with fundamental requirement: execute
all events asynchronously - there must be no emitter functionality function frames on the stack.

All other event emitters implementations are synchronous - they call handlers when event is emitted.

Second important feature - strict check of preconfigured allowed event types.

**Documentation** --> [FutoIn Guide](https://futoin.org/docs/miscjs/asyncevent/)

Reference implementation of:
 
    FTN15: Native Event API
    Version: 1.1
    
Spec: [FTN15: Native Event API v1.x](http://specs.futoin.org/final/preview/ftn15_native_event-1.html)

Author: [Andrey Galkin](mailto:andrey@futoin.org)


# Extra details

1. `setImmediate` / `setTimeout(handler, 0)` is used for each handler.
    - All exceptions can be traced runtime-defined way.
2. `EventEmitter` instance is hidden in `target[EventEmitter.SYM_EVENT_EMITTER]` property.
    - Almost no pollution to target object
    - Very fast lookup
    - `on()`, `off()`, `once()` and `emit()` are defined as properties which proxy call
3. At the moment, `emit()` uses ES6 spread oprerator (e.g. `...args`):
    - the approach which is around 4 times faster in Node.js compared to old ES5 browsers
    - there are no optimizations done yet (no significant case so far)
4. Each event has own "on" and "once" arrays:
    - performance over memory tradeoff
    - "once" array is simply discarded and replaced after first use, if there are any handlers
    - `on()`/`once()` calls are cheap
    - `off()` call uses `array#filter()`
    - the same handler can be added more than once, but it gets removed on first `off()` call
    - `off()` removes handler both from "on" and "once" arrays
5. Async event dispatch considerations:
    - `once( 'event', () => o.once( 'event', ... ) )` approach IS NOT SAFE as it leads to missed events!
    - avoid emitting too many events in a synchronous loop - event handlers get scheduled, but not executed!
    

# Installation for Node.js

Command line:
```sh
$ npm install futoin-asyncevent --save
```
or
```sh
$ yarn add futoin-asyncevent
```

*Hint: checkout [FutoIn CID](https://github.com/futoin/cid-tool) for all tools setup.*

# Browser installation

Pre-built ES5 CJS modules are available under `es5/`. These modules
can be used with `webpack` without transpiler - default "browser" entry point
points to ES5 version.

Webpack dists are also available under `dist/` folder, but their usage should be limited
to sites without build process.

*Warning: older browsers should use `dist/polyfill-asyncevent.js` for `Symbol`.*

*The following globals are available:*

* $asyncevent - global reference to futoin-asyncevent module
* futoin - global namespace-like object for name clashing cases
* futoin.$asyncevent - another reference to futoin-asyncevent module
* futoin.EventEmitter - global reference to futoin-asyncevent.EventEmitter class

# Examples

## Simple steps

```javascript
const $asyncevent = require('futoin-asyncevent');

class FirstClass {
    constructor() {
        // dynamically extend & pre-configure allowed events
        $asyncevent(this, ['event_one', 'event_two', 'event_three']);
    }
    
    someFunc() {
        this.emit( 'event_one', 'some_arg', 2, true );
    }
}

const o = new FirstClass();
const h = (a, b, c) => console.log(a, b, c);

// Basic event operation
// ---------------------
o.on('event_one', h);
o.off('event_one', h);
o.once('event_two', () => console.log('Second'));
o.someFunc();

// Advanced
// --------

// instanceof hook (ES6)
(o instanceof $asyncevent.EventEmitter) === true

// update max listeners warning threshold
$asyncevent.EventEmitter.setMaxListeners( o, 16 );

```
    
# API documentation

The concept is described in FutoIn specification: [FTN15: Native Event API v1.x](http://specs.futoin.org/final/preview/ftn15_native_event-1.html)

## Classes

<dl>
<dt><a href="#EventEmitter">EventEmitter</a></dt>
<dd><p>Asynchronous Event Emitter.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#$asyncevent">$asyncevent</a></dt>
<dd><p><strong>window.$asyncevent</strong> - browser-only reference to futoin-asyncsteps module</p>
</dd>
<dt><a href="#$asyncevent">$asyncevent</a></dt>
<dd><p><strong>window.FutoIn.$asyncevent</strong> - browser-only reference to futoin-asyncsteps module</p>
</dd>
<dt><a href="#EventEmitter">EventEmitter</a></dt>
<dd><p><strong>window.futoin.EventEmitter</strong> - browser-only reference to futoin-asyncsteps.EventEmitter</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#$asyncevent">$asyncevent</a></dt>
<dd><p>Attach event emitter properties to object. Call it in c-tor.</p>
</dd>
</dl>

<a name="EventEmitter"></a>

## EventEmitter
Asynchronous Event Emitter.

**Kind**: global class  
**Note**: Please avoid inheritting it, use EventEmitter.attach() instead!  

* [EventEmitter](#EventEmitter)
    * _instance_
        * [.on(evt, handler)](#EventEmitter+on)
        * [.once(evt, handler)](#EventEmitter+once)
        * [.off(evt, handler)](#EventEmitter+off)
        * [.emit(evt)](#EventEmitter+emit)
    * _static_
        * [.attach(instance, allowed_events, max_listeners)](#EventEmitter.attach)
        * [.setMaxListeners(instance, max_listeners)](#EventEmitter.setMaxListeners)

<a name="EventEmitter+on"></a>

### eventEmitter.on(evt, handler)
Attach event handler.

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>string</code> | preconfigured event name |
| handler | <code>callable</code> | async event handler |

<a name="EventEmitter+once"></a>

### eventEmitter.once(evt, handler)
Attach once-only event handler.

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>string</code> | preconfigured event name |
| handler | <code>callable</code> | async event handler |

<a name="EventEmitter+off"></a>

### eventEmitter.off(evt, handler)
Remove event handler.

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>string</code> | preconfigured event name |
| handler | <code>callable</code> | async event handler |

<a name="EventEmitter+emit"></a>

### eventEmitter.emit(evt)
Emit async event.

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>string</code> | event name |

<a name="EventEmitter.attach"></a>

### EventEmitter.attach(instance, allowed_events, max_listeners)
Attach event emitter to any instance

**Kind**: static method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| instance | <code>object</code> |  | target object |
| allowed_events | <code>array</code> |  | list of allowed event names |
| max_listeners | <code>integer</code> | <code>8</code> | maximum allowed handlers per event name |

<a name="EventEmitter.setMaxListeners"></a>

### EventEmitter.setMaxListeners(instance, max_listeners)
Dynamically update max listener count

**Kind**: static method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>object</code> | target object |
| max_listeners | <code>integer</code> | maximum allowed handlers per event name |

<a name="$asyncevent"></a>

## $asyncevent
**window.$asyncevent** - browser-only reference to futoin-asyncsteps module

**Kind**: global variable  
<a name="$asyncevent.EventEmitter"></a>

### $asyncevent.EventEmitter
Reference to EventEmitter class

**Kind**: static property of [<code>$asyncevent</code>](#$asyncevent)  
<a name="$asyncevent"></a>

## $asyncevent
**window.FutoIn.$asyncevent** - browser-only reference to futoin-asyncsteps module

**Kind**: global variable  
<a name="$asyncevent.EventEmitter"></a>

### $asyncevent.EventEmitter
Reference to EventEmitter class

**Kind**: static property of [<code>$asyncevent</code>](#$asyncevent)  
<a name="EventEmitter"></a>

## EventEmitter
**window.futoin.EventEmitter** - browser-only reference to futoin-asyncsteps.EventEmitter

**Kind**: global variable  

* [EventEmitter](#EventEmitter)
    * _instance_
        * [.on(evt, handler)](#EventEmitter+on)
        * [.once(evt, handler)](#EventEmitter+once)
        * [.off(evt, handler)](#EventEmitter+off)
        * [.emit(evt)](#EventEmitter+emit)
    * _static_
        * [.attach(instance, allowed_events, max_listeners)](#EventEmitter.attach)
        * [.setMaxListeners(instance, max_listeners)](#EventEmitter.setMaxListeners)

<a name="EventEmitter+on"></a>

### eventEmitter.on(evt, handler)
Attach event handler.

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>string</code> | preconfigured event name |
| handler | <code>callable</code> | async event handler |

<a name="EventEmitter+once"></a>

### eventEmitter.once(evt, handler)
Attach once-only event handler.

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>string</code> | preconfigured event name |
| handler | <code>callable</code> | async event handler |

<a name="EventEmitter+off"></a>

### eventEmitter.off(evt, handler)
Remove event handler.

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>string</code> | preconfigured event name |
| handler | <code>callable</code> | async event handler |

<a name="EventEmitter+emit"></a>

### eventEmitter.emit(evt)
Emit async event.

**Kind**: instance method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| evt | <code>string</code> | event name |

<a name="EventEmitter.attach"></a>

### EventEmitter.attach(instance, allowed_events, max_listeners)
Attach event emitter to any instance

**Kind**: static method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| instance | <code>object</code> |  | target object |
| allowed_events | <code>array</code> |  | list of allowed event names |
| max_listeners | <code>integer</code> | <code>8</code> | maximum allowed handlers per event name |

<a name="EventEmitter.setMaxListeners"></a>

### EventEmitter.setMaxListeners(instance, max_listeners)
Dynamically update max listener count

**Kind**: static method of [<code>EventEmitter</code>](#EventEmitter)  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>object</code> | target object |
| max_listeners | <code>integer</code> | maximum allowed handlers per event name |

<a name="$asyncevent"></a>

## $asyncevent
Attach event emitter properties to object. Call it in c-tor.

**Kind**: global constant  
**See**: EventEmitter.attach()  
<a name="$asyncevent.EventEmitter"></a>

### $asyncevent.EventEmitter
Reference to EventEmitter class

**Kind**: static property of [<code>$asyncevent</code>](#$asyncevent)  


*documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)*.


