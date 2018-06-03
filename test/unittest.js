'use strict';

// ensure it works with frozen one
Object.freeze( Object.prototype );

//
const $asyncevent = ( typeof window !== 'undefined' )
    ? require( 'futoin-asyncevent' )
    : module.require( '../lib/asyncevent' );
const { expect } = require( 'chai' );

const SYM_EVENT_EMITTER = $asyncevent.EventEmitter.SYM_EVENT_EMITTER;

describe( 'EventEmitter', function() {
    describe(
        '.attach()', function() {
            it( "should attach", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );
            } );


            it( "should allow additional registrationk", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );
                $asyncevent( o, [ 'd' ] );
            } );

            it( "should fail on double registration", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );

                expect( () => $asyncevent( o, [ 'b' ] ) )
                    .to.throw( 'Event "b" has been already registered!' );
            } );
        }
    );

    describe(
        '.on()', function() {
            it( "should attach handlers", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );
                $asyncevent( o, [ 'd' ] );
                o.on( 'a', () => {} );
                o.on( 'a', () => {} );
                o.on( 'b', () => {} );
                o.on( 'd', () => {} );

                expect( o[SYM_EVENT_EMITTER]._evt_a.length ).to.equal( 2 );
                expect( o[SYM_EVENT_EMITTER]._evt_b.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evt_c.length ).to.equal( 0 );
                expect( o[SYM_EVENT_EMITTER]._evt_d.length ).to.equal( 1 );
            } );

            it( "should fail on unknown event", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );

                expect( () => o.on( 'd', () => {} ) )
                    .to.throw( 'Unknown event: d' );
            } );
        }
    );

    describe(
        '.once()', function() {
            it( "should attach handlers", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );
                o.once( 'a', () => {} );
                o.once( 'a', () => {} );
                o.once( 'b', () => {} );

                expect( o[SYM_EVENT_EMITTER]._evtonce_a.length ).to.equal( 2 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_b.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_c.length ).to.equal( 0 );
            } );

            it( "should fail on unknown event", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );

                expect( () => o.once( 'd', () => {} ) )
                    .to.throw( 'Unknown event: d' );
            } );
        }
    );

    describe(
        '.off()', function() {
            it( "should detach handlers", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );
                let a1 = () => {};
                let a2 = () => {};
                let b1 = () => {};
                let a1o = () => {};
                let b1o = () => {};
                let b2o = () => {};

                o.on( 'a', a1 );
                o.on( 'a', a2 );
                o.on( 'b', b1 );
                o.once( 'a', a1o );
                o.once( 'b', b1o );
                o.once( 'b', b2o );

                expect( o[SYM_EVENT_EMITTER]._evt_a.length ).to.equal( 2 );
                expect( o[SYM_EVENT_EMITTER]._evt_b.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evt_c.length ).to.equal( 0 );

                expect( o[SYM_EVENT_EMITTER]._evtonce_a.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_b.length ).to.equal( 2 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_c.length ).to.equal( 0 );

                // ---
                o.off( 'a' );
                expect( o[SYM_EVENT_EMITTER]._evt_a.length ).to.equal( 2 );
                expect( o[SYM_EVENT_EMITTER]._evt_b.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evt_c.length ).to.equal( 0 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_a.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_b.length ).to.equal( 2 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_c.length ).to.equal( 0 );

                // ---
                o.off( 'a', a1 );
                expect( o[SYM_EVENT_EMITTER]._evt_a.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evt_b.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evt_c.length ).to.equal( 0 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_a.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_b.length ).to.equal( 2 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_c.length ).to.equal( 0 );

                // ---
                o.off( 'a', a1 );
                expect( o[SYM_EVENT_EMITTER]._evt_a.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evt_b.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evt_c.length ).to.equal( 0 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_a.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_b.length ).to.equal( 2 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_c.length ).to.equal( 0 );

                // ---
                o.off( 'a', a2 );
                expect( o[SYM_EVENT_EMITTER]._evt_a.length ).to.equal( 0 );
                expect( o[SYM_EVENT_EMITTER]._evt_b.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evt_c.length ).to.equal( 0 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_a.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_b.length ).to.equal( 2 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_c.length ).to.equal( 0 );

                // ---
                o.off( 'a', a1o );
                expect( o[SYM_EVENT_EMITTER]._evt_a.length ).to.equal( 0 );
                expect( o[SYM_EVENT_EMITTER]._evt_b.length ).to.equal( 1 );
                expect( o[SYM_EVENT_EMITTER]._evt_c.length ).to.equal( 0 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_a.length ).to.equal( 0 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_b.length ).to.equal( 2 );
                expect( o[SYM_EVENT_EMITTER]._evtonce_c.length ).to.equal( 0 );
            } );

            it( "should fail on unknown event", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );

                expect( () => o.off( 'd', () => {} ) )
                    .to.throw( 'Unknown event: d' );
            } );
        }
    );


    describe(
        '.emit()', function() {
            it( "should work on empty list", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );
                o.emit( 'a' );
                o.emit( 'a' );
                o.emit( 'b' );
            } );

            it( "should fail on unknown event", function() {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );

                expect( () => o.emit( 'd' ) )
                    .to.throw( 'Unknown event: d' );
            } );

            it( "should correctly process events", function( done ) {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );

                let spies = {
                    a: 0,
                    b: 0,
                    c: 0,
                };

                o.emit( 'a' );
                o.emit( 'a' );
                o.emit( 'b' );

                // ---
                o.on( 'a', ( a, b, c, d ) => {
                    try {
                        expect( a ).to.equal( 'A' );
                        expect( b ).to.equal( 1 );
                        expect( c ).to.equal( true );
                        expect( d ).to.be.undefined;
                    } catch ( e ) {
                        done( e );
                    }

                    spies.a += 1;
                } );
                o.on( 'a', () => {
                    spies.a += 1;
                } );
                o.once( 'a', () => {
                    spies.a += 1;
                } );
                o.on( 'b', () => {
                    spies.b += 1;
                } );

                o.emit( 'a', 'A', 1, true );

                // ---
                o.once( 'a', () => {
                    try {
                        expect( spies ).to.eql( {
                            a: 5,
                            b: 0,
                            c: 0,
                        } );
                        done();
                    } catch ( e ) {
                        done( e );
                    }
                } );

                o.emit( 'a', 'A', 1, true );

                expect( spies ).to.eql( {
                    a: 0,
                    b: 0,
                    c: 0,
                } );
            } );

            it( "should process events fast enough", function( done ) {
                const o = {};
                $asyncevent( o, [ 'a', 'b', 'c' ] );

                let spies = {
                    a: 0,
                };

                const EVT_NUM = 1e5;

                o.on( 'a', ( a, b, c, d ) => {
                    spies.a += 1;

                    if ( spies.a === EVT_NUM ) {
                        done();
                    }
                } );

                for ( let i = 0; i < EVT_NUM; ++i ) {
                    o.emit( 'a', 'A', 1, true );
                }

                expect( spies.a ).to.equal( 0 );
            } );

            it( "should support max listeners soft threshold", function() {
                const o = { called: 0 };

                $asyncevent( o, [ 'a', 'b', 'c' ] );

                const bak = console.warn;
                console.warn = ( m ) => {
                    o.called += 1;
                    expect( m ).to.equal(
                        `Hitting max ${o.called < 3 ? '': 'once '}handler limit for: a` );
                };

                $asyncevent.EventEmitter.setMaxListeners( o, 1 );

                o.on( 'a', () => {} );
                o.on( 'a', () => {} );
                o.on( 'a', () => {} );
                o.once( 'a', () => {} );
                expect( o.called ).to.equal( 1 );

                $asyncevent.EventEmitter.setMaxListeners( o, 3 );
                o.on( 'a', () => {} );
                o.on( 'a', () => {} );

                expect( o.called ).to.equal( 2 );
                o.once( 'a', () => {} );
                o.once( 'a', () => {} );
                expect( o.called ).to.equal( 2 );
                o.once( 'a', () => {} );
                expect( o.called ).to.equal( 3 );

                console.warn = bak;
            } );

            if ( typeof window === 'undefined' ) {
                it( "should support instanceof", function() {
                    const o = {};

                    expect( o instanceof $asyncevent.EventEmitter ).to.be.false;

                    $asyncevent( o, [ 'a', 'b', 'c' ] );

                    expect( o instanceof $asyncevent.EventEmitter ).to.be.true;
                } );
            }
        }
    );
} );

if ( typeof window !== 'undefined' ) {
    describe(
        'Globals', function() {
            it( '$asyncevent should be set', function() {
                expect( window.$asyncevent ).to.equal( $asyncevent );
            } );
            it( 'FutoIn.$asyncevent should be set', function() {
                expect( window.FutoIn.$asyncevent ).to.equal( $asyncevent );
                expect( window.futoin.$asyncevent ).to.equal( $asyncevent );
            } );
            it( 'FutoIn.EventEmitter should be set', function() {
                expect( window.FutoIn.EventEmitter ).to.equal( $asyncevent.EventEmitter );
                expect( window.futoin.EventEmitter ).to.equal( $asyncevent.EventEmitter );
            } );
        }
    );
}
