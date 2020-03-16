configCode = {
    highlight: [{
            highlight: [
                'onData{',
                'OnClick{',
                'EndAnimation{',
                'OnLongClick{',
                'OnFocusIn{',
                'OnKeyPress{',
                'OnTouch{',
                'OnDoubleClick{',
                'OnBottomSheetOpen{',
                'OnBottomSheetClose{',
                'OnBottomSheetSlide{',
                'OnFocusOut{',
                'OnLoad{',
                'comments{',
                'onSwipeTop{',
                'onSwipeRight{',
                'onSwipeLeft{',
                'onSwipeBottom{',
                'onMove{',
                'onDataSuccess{',
                'onDataError{',
                'onDataStarted{',
            ],
            className: 'code-event'
        },
        {
            highlight: '}',
            className: 'code-event-key'
        },
        {
            highlight: '::',
            className: 'code-invoke-key'
        },
        {
            highlight: '(?i)(\W|^)(baloney|darn|drat|fooey|gosh\sdarnit|heck)(\W|$)',
            className: 'code-invoke-key'
        },
        {
            highlight: ['true', 'false'],
            className: 'code-invoke-boolean'
        },
        {
            highlight: '->',
            className: 'code-invoke-key'
        },
        {
            highlight: '<-',
            className: 'imported-invoke-key'
        },
        {
            highlight: [
                'showSnack(',
                'speed(',
                'equals(',
                'contains(',
                'less(',
                'filter(',
                'use(',
                'hideToolbar(',
                'showToolbar(',
                'bigger(',
                'hide(',
                'get(',
                'set(',
                'show(',
                'setHeader(',
                'insert(',
                'invoke(',
                'play(',
                'reset(',
                'openBottomSheet(',
                'hideBottomSheet(',
                'loop(',
                'pause(',
                'showToast(',
                'setIcon(',
                'setText(',
                'clear(',
                'appendText(',
                'fadeIn(',
                'fadeOut(',
                'setError(',
                'invokeAnimation(',
                'shake(',
                'countDown(',
                'resize(',
                'share(',
                'enable(',
                'disable(',
                'setTextColor(',
                'startContainer(',
                'translation(',
                'moveY(',
                'moveX(',
                'rotateY(',
                'rotateX(',
                'rotate(',
                'setRippleColor(',
                'setImage(',
                'getRippleColor(',
                'showPush(',
                'setColor(',
                'setCache(',
                'getCache(',
                'date(',
                'startapp(',
                'exec(',
                'navigate(',
                'opacity(',
                'json(',
                'calc(',
                'reload(',
                'hideLoading(',
                'showLoading(',
                'startBottomSheet(',
                'setTitle(',
                'setBackgroundColor(',
                'animateDropOut(',
                'animateLanding(',
                'animateTakingOff(',
                'animateLinear(',
                'animateFlash(',
                'animatePulse(',
                'animateRubberBand(',
                'animateShake(',
                'animateSwing(',
                'animateWobber(',
                'animateBounce(',
                'animateTada(',
                'animateStandUp(',
                'animateWave(',
                'animateHinger(',
                'animateRollIn(',
                'animateRollOut(',
                'animateBounceIn(',
                'animateBounceInDown(',
                'animateBounceInLeft(',
                'animateBounceInRight(',
                'animateBounceInUp(',
                'animateFadeIn(',
                'animateFadeInUp(',
                'animateFadeInDown(',
                'animateFadeInLeft(',
                'animateFadeInRight(',
                'animateFadeOut(',
                'animateFadeOutUp(',
                'animateFadeOutDown(',
                'animateFadeOutLeft(',
                'animateFadeOutRight(',
                'animateFlipInX(',
                'animateFlipOutX(',
                'animateFlipInY(',
                'animateFlipOutY(',
                'animateRotateIn(',
                'animateRotateInDownLeft(',
                'animateRotateInDownRight(',
                'animateRotateInUpLeft(',
                'animateRotateInUpRight(',
                'animateRotateOut(',
                'animateRotateOutDownLeft(',
                'animateRotateOutDownRight(',
                'animateRotateOutUpLeft(',
                'animateRotateOutUpRight(',
                'animateSlideInLeft(',
                'animateSlideInRight(',
                'animateSlideInUp(',
                'animateSlideInDown(',
                'animateSlideOutLeft(',
                'animateSlideOutRight(',
                'animateSlideOutUp(',
                'animateSlideOutDown(',
                'animateZoomIn(',
                'animateZoomInDown(',
                'animateZoomInLeft(',
                'animateZoomInRight(',
                'animateZoomInUp(',
                'animateZoomOut(',
                'animateZoomOutDown(',
                'animateZoomOutLeft(',
                'animateZoomOutRight(',
                'animateZoomOutUp('


            ],
            className: 'code-method'
        },
        {
            highlight: ['import', '[', ']'],
            className: 'imported-for-mobile'
        },
        {
            highlight: ['import', ';', ')'],
            className: 'code-method'
        },
        {
            highlight: ['import', '[', ']'],
            className: 'imported-for-mobile'
        },
        {
            highlight: [' var '],
            className: 'variable-code'
        },
        {
            highlight: /\/[\*]+.*|g(oo|ee)se/gi,
            className: 'code-is-comments'
        },
        {
            highlight: /(\w+[.])|g(oo|ee)se/gi,
            className: 'code-is-element'
        },

        {
            highlight: ['@'],
            className: 'code-is-element'
        },

        {
            highlight: /(\w+[=])|g(oo|ee)se/gi,
            className: 'code-is-element'
        },
        {
            highlight: /([@]\w+)|g(oo|ee)se/gi,
            className: 'code-is-element'
        },
        {
            highlight: /([.]\w+)|g(oo|ee)se/gi,
            className: 'code-is-attr'
        },

        {
            highlight: /(\[!]+w)|g(oo|ee)se/gi,
            className: 'code-is-element'
        },

        {
            highlight: /(\$+\w+)|g(oo|ee)se/gi,
            className: 'variable-code'
        },

        {
            highlight: /(\#+\w+)|g(oo|ee)se/gi,
            className: 'color-code'
        }
    ]
}



var viewCodes = {
    highlight: [{
            highlight: [
                'onData{  }',
                'OnClick{  } ',
                'OnBottomSheetOpen{  }',
                'OnBottomSheetClose{  }',
                'OnBottomSheetSlide{  }',
                'EndAnimation{   }',
                'OnLongClick{   }',
                'OnFocusIn{   }',
                'OnKeyPress{   }',
                'OnTouch{   }',
                'OnDoubleClick{   }',
                'onMove{  }',
                'OnFocusOut{   }',
                'OnLoad{   }',
                'comments{   }',
                'onSwipeTop{   }',
                'onSwipeRight{   }',
                'onSwipeLeft{   }',
                'onSwipeBottom{  }',
                'onDataSuccess{  }',
                'onDataError{  }',
                'onDataStarted{  }'
            ],
            className: 'code-event'
        },
        {
            highlight: '}',
            className: 'code-event-key'
        },
        {
            highlight: '::',
            className: 'code-invoke-key'
        },
        {
            highlight: ['true', 'false'],
            className: 'code-invoke-boolean'
        },
        {
            highlight: '->',
            className: 'code-invoke-key'
        },
        {
            highlight: '<-',
            className: 'imported-invoke-key'
        },
        {
            highlight: [
                'showSnack( text )',
                'speed( number )',
                'equals( any, any )',
                'contains( any, any )',
                'less( number, number )',
                'filter( text )',
                'use( text )',
                'hideToolbar()',
                'showToolbar()',
                'bigger( number, number )',
                'hide()',
                'show()',
                'invoke( text )',
                'play()',
                'reset()',
                'reload(',
                'hideLoading()',
                'showLoading()',
                'openBottomSheet()',
                'hideBottomSheet()',
                'loop( number )',
                'pause()',
                'showToast(text)',
                'setIcon( text )',
                'setHeader( key: value, key: value, ... )',
                'insert()',
                'setText( text )',
                'clear()',
                'appendText( text )',
                'fadeIn()',
                'fadeOut()',
                'shake()',
                'setError( text )',
                'opacity( number )',
                'countDown( number, number )',
                'countDown( number, number, boolean )',
                'resize( number, number )',
                'share( text )',
                'enable()',
                'disable()',
                'setTextColor( text )',
                'startContainer( text )',
                'moveY( number )',
                'moveX( number )',
                'rotateY( number )',
                'rotateX( number )',
                'rotate( number, number )',
                'setRippleColor( text )',
                'setImage( text )',
                'getRippleColor( text )',
                'showPush( text )',
                'showPush( text, text )',
                'showPush( text, text, text )',
                'showPush( text, text, text, text )',
                'setColor( text )',
                'setCache( text, text )',
                'getCache( text )',
                'date()',
                'date( text )',
                'startapp( text )',
                'exec( text )',
                'navigate( text )',
                'json( text )',
                'calc( text )',
                'startbottomsheet( text )',
                'setTitle( text )',
                'setBackgroundColor( text )',
                'animateDropOut( number )',
                'animateLanding( number )',
                'animateTakingOff( number )',
                'animateLinear( number )',
                'animateFlash( number )',
                'animatePulse( number )',
                'animateRubberBand( number )',
                'animateShake( number )',
                'animateSwing( number )',
                'animateWobber( number )',
                'animateBounce( number )',
                'animateTada( number )',
                'animateStandUp( number )',
                'animateWave( number )',
                'animateHinger( number )',
                'animateRollIn( number )',
                'animateRollOut( number )',
                'animateBounceIn( number )',
                'animateBounceInDown( number )',
                'animateBounceInLeft( number )',
                'animateBounceInRight( number )',
                'animateBounceInUp( number )',
                'animateFadeIn( number )',
                'animateFadeInUp( number )',
                'animateFadeInDown( number )',
                'animateFadeInLeft( number )',
                'animateFadeInRight( number )',
                'animateFadeOut( number )',
                'animateFadeOutUp( number )',
                'animateFadeOutDown( number )',
                'animateFadeOutLeft( number )',
                'animateFadeOutRight( number )',
                'animateFlipInX( number )',
                'animateFlipOutX( number )',
                'animateFlipInY( number )',
                'animateFlipOutY( number )',
                'animateRotateIn( number )',
                'animateRotateInDownLeft( number )',
                'animateRotateInDownRight( number )',
                'animateRotateInUpLeft( number )',
                'animateRotateInUpRight( number )',
                'animateRotateOut( number )',
                'animateRotateOutDownLeft( number )',
                'animateRotateOutDownRight( number )',
                'animateRotateOutUpLeft( number )',
                'animateRotateOutUpRight( number )',
                'animateSlideInLeft( number )',
                'animateSlideInRight( number )',
                'animateSlideInUp( number )',
                'animateSlideInDown( number )',
                'animateSlideOutLeft( number )',
                'animateSlideOutRight( number )',
                'animateSlideOutUp( number )',
                'animateSlideOutDown( number )',
                'animateZoomIn( number )',
                'animateZoomInDown( number )',
                'animateZoomInLeft( number )',
                'animateZoomInRight( number )',
                'animateZoomInUp( number )',
                'animateZoomOut( number )',
                'animateZoomOutDown( number )',
                'animateZoomOutLeft( number )',
                'animateZoomOutRight( number )',
                'animateZoomOutUp( number )'


            ],
            className: 'code-method'
        },
        {
            highlight: ['import', '[', ']'],
            className: 'imported-for-mobile'
        },
        {
            highlight: ['import', ';', ')'],
            className: 'code-method'
        },
        {
            highlight: ['import', '[', ']'],
            className: 'imported-for-mobile'
        },
        {
            highlight: [' var '],
            className: 'variable-code'
        },
        {
            highlight: /\/[\*]+.*|g(oo|ee)se/gi,
            className: 'code-is-comments'
        },
        {
            highlight: /(\w+[.])|g(oo|ee)se/gi,
            className: 'code-is-element'
        },

        {
            highlight: /(\w+[=])|g(oo|ee)se/gi,
            className: 'code-is-element'
        },

        {
            highlight: /(\[!]+w)|g(oo|ee)se/gi,
            className: 'code-is-element'
        },

        {
            highlight: /(\$+\w+)|g(oo|ee)se/gi,
            className: 'variable-code'
        },

        {
            highlight: /(\#+\w+)|g(oo|ee)se/gi,
            className: 'color-code'
        }
    ]
}



function lightOrDark(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

        r = color[1];
        g = color[2];
        b = color[3];
    } else {

        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace(
            color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {

        return 'light';
    } else {

        return 'dark';
    }
}

// invoke(contact.phone)::button2.setText(Telefone:&& contact.phone);
$('.kotlin').highlightWithinTextarea(configCode);