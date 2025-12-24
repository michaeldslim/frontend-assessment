// Libraries
import { CSSProperties } from 'react';
import { createTheme } from '@mui/material/styles';

// Utils
import { pxrem } from '@/utils/pxrem';

// Global Styles
import { veryableBlue } from './globalStyles';

declare module '@mui/material/styles' {

    interface PaletteColor {
        highlight?: string;
    }

    interface SimplePaletteColorOptions {
        highlight?: string;
    }

    export interface TypeBackground {
        default: string;
        paper: string;
        header: string;
    }

    interface TypographyVariants {
        caption: CSSProperties;
        finePrint: CSSProperties;
    }

    interface TypographyVariantsOptions {
        caption?: CSSProperties;
        finePrint?: CSSProperties;
    }

    interface Palette {
        captain: {
            one: string;
            two: string;
            three: string;
            colorOnColor: string;
        };
        hulk: {
            one: string;
            two: string;
            three: string;
            colorOnColor: string;
        };
        panther: {
            one: string;
            two: string;
            three: string;
            colorOnColor: string;
        };
        ironman: {
            one: string;
            two: string;
            three: string;
            colorOnColor: string;
        };
        thor: {
            one: string;
            two: string;
            three: string;
            colorOnColor: string;
        };
        neutral: {
            one: string;
            two: string;
            three: string;
            four: string;
            five: string;
            six: string;
            seven: string;
            eight: string;
            nine: string;
            background: string;
            surface: string;
            lightColorOnColor: string;
            darkColorOnColor: string;
        };
        iceberg: {
            main: string;
        };
        pearl: {
            main: string;
        };
        butter: {
            main: string;
        };
        azure: {
            main: string;
        };
        mint: {
            main: string;
        };
        lavender: {
            main: string;
        };
        alabaster: {
            main: string;
        };
        coconut: {
            main: string;
        };
        pistachio: {
            main: string;
        };
    }

    interface PaletteOptions {
        captain?: {
            one?: string;
            two?: string;
            three?: string;
            colorOnColor?: string;
        };
        hulk?: {
            one?: string;
            two?: string;
            three?: string;
            colorOnColor?: string;
        };
        panther?: {
            one?: string;
            two?: string;
            three?: string;
            colorOnColor?: string;
        };
        ironman?: {
            one?: string;
            two?: string;
            three?: string;
            colorOnColor?: string;
        };
        thor?: {
            one?: string;
            two?: string;
            three?: string;
            colorOnColor?: string;
        };
        neutral?: {
            one?: string;
            two?: string;
            three?: string;
            four?: string;
            five?: string;
            six?: string;
            seven?: string;
            eight?: string;
            nine?: string;
            background?: string;
            surface?: string;
            lightColorOnColor?: string;
            darkColorOnColor?: string;
        };
        iceberg?: {
            main?: string;
        };
        pearl?: {
            main?: string;
        };
        butter?: {
            main?: string;
        };
        azure?: {
            main?: string;
        };
        mint?: {
            main?: string;
        };
        lavender?: {
            main?: string;
        };
        alabaster?: {
            main?: string;
        };
        coconut?: {
            main?: string;
        };
        pistachio?: {
            main?: string;
        };
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        caption: true;
        finePrint: true;
    }
}
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        gray: true;
    }
}

export const themeV3 = createTheme( {
    palette: {
        mode: 'light'
        , primary: {
            main: '#2081C3' // captain.two
            , light: '#E5F5FF' // captain.three
            , dark: '#1D71AF' // captain.one
            , contrastText: '#FFFFFF'
        }
        , captain: {
            one: '#1D71AF'
            , two: '#2081C3'
            , three: '#E5F5FF'
            , colorOnColor: '#1D71AF'
        }
        , hulk: {
            one: '#297273'
            , two: '#68AAAB'
            , three: '#D2EEE2'
            , colorOnColor: '#297273'
        }
        , panther: {
            one: '#6451B6'
            , two: '#8C7AD9'
            , three: '#EEEBFF'
            , colorOnColor: '#6451B6'
        }
        , ironman: {
            one: '#C70C17'
            , two: '#E91D29'
            , three: '#FFE5E7'
            , colorOnColor: '#C70C17'
        }
        , thor: {
            one: '#E27900'
            , two: '#FF8800'
            , three: '#FFEEE5'
            , colorOnColor: '#E27900'
        }
        , neutral: {
            one: '#141414'
            , two: '#525252'
            , three: '#656565'
            , four: '#8C8C8C'
            , five: '#ADADAD'
            , six: '#D2D2D2'
            , seven: '#E3E3E3'
            , eight: '#EFEFEF'
            , nine: '#F7F7F7'
            , background: '#F1F5F6'
            , surface: '#FFFFFF'
            , lightColorOnColor: '#FFFFFF'
            , darkColorOnColor: '#141414'
        }
        , iceberg: {
            main: '#E0F2F1'
        }
        , pearl: {
            main: '#F6E4EB'
        }
        , butter: {
            main: '#F4EBCA'
        }
        , azure: {
            main: '#E8F2FE'
        }
        , mint: {
            main: '#E9F7E6'
        }
        , lavender: {
            main: '#EBE5F3'
        }
        , alabaster: {
            main: '#F5F1EE'
        }
        , coconut: {
            main: '#FDECDC'
        }
        , pistachio: {
            main: '#EAEFEB'
        }
    }
    , typography: {
        fontFamily: [
            'Avenir Next'
            , 'Open Sans'
            , 'sans-serif'
        ].join( ',' )
        , fontSize: 14
        , h1: {
            color: veryableBlue
            , fontSize: pxrem( 30 )
            , fontWeight: 600
        }
        , h2: {
            color: '#525252'
            , fontSize: pxrem( 24 )
            , fontWeight: 600
        }
        , h3: {
            fontSize: pxrem( 22 )
            , fontWeight: 600
        }
        , h4: {
            fontSize: pxrem( 18 )
            , fontWeight: 600
            , lineHeight: pxrem( 26 )
            , color: '#525252'
        }
        , h5: {
            fontSize: pxrem( 16 )
            , fontWeight: 600
            , lineHeight: pxrem( 24 )
            , letterSpacing: '0em'
            , textAlign: 'left'
        }
        , h6: {
            color: '#525252'
            , fontSize: pxrem( 14 )
            , fontWeight: 600
        }
        , button: {
            fontWeight: 600
        }
        , body1: {
            fontSize: pxrem( 16 )
        }
        , body2: {
            fontSize: pxrem( 14 )
        }
        , caption: {
            fontSize: pxrem( 12 )
        }
        , finePrint: {
            fontSize: pxrem( 10 )
        }
        , subtitle2: {
            fontSize: pxrem( 14 )
            , fontWeight: 500
        }
    }
} );
