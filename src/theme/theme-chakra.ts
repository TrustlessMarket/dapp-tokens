import { extendTheme } from '@chakra-ui/react';
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { FaAssistiveListeningSystems } from 'react-icons/fa';

const Text: ComponentStyleConfig = {
  baseStyle: {
    color: 'inherit',
  },
  variants: {
    primary: {
      color: 'text.primary',
    },
    secondary: {
      color: 'text.secondary',
    },
    warning: {
      color: 'brand.primary',
      fontWeight: 'medium',
    },
    label: {
      fontWeight: 'medium',
      color: 'text.secondary',
      fontSize: 'xs',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
  },
};

const Heading: ComponentStyleConfig = {
  baseStyle: {
    fontFamily: 'InterTight',
  },
};

const Button: ComponentStyleConfig = {
  defaultProps: {
    colorScheme: 'text.accent',
  },
  baseStyle: {
    borderRadius: 100,
    fontWeight: 500,
    fontSize: 14,
  },
  variants: {
    solid: {
      bgGradient: 'linear-gradient(90deg, #11988D 0%, #38EF7D 100%)',
      _hover: {
        opacity: 0.8,
      },
    },
    link: {
      textDecoration: 'underline',
    },
    outline: {
      borderWidth: 1,
      borderColor: 'text.accent',
      color: 'text.primary',
      fontWeight: 'medium',
      _hover: {
        bgColor: 'text.accent',
        color: 'white',
      },
    },
  },
};

const Image: ComponentStyleConfig = {
  baseStyle: {
    display: 'inline-block',
  },
};

const Tabs: ComponentStyleConfig = {
  variants: {
    enclosed: {
      tablist: {
        borderColor: 'background.border',
      },
      tab: {
        color: 'text.secondary',
        _focus: {
          boxShadow: 'none',
        },
        _selected: {
          color: 'text.primary',
          boxShadow: 'none',
          borderColor: 'background.border',
          borderBottomColor: 'black',
        },
      },
    },
    icons: {
      tablist: {
        border: 'none',
      },
      tab: {
        color: 'text.secondary',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: '8px',
        _hover: {
          color: 'text.primary',
          bgColor: 'background.card',
          borderColor: 'background.card',
        },
        _selected: {
          color: 'text.primary',
          bgColor: 'background.card',
          borderColor: 'background.card',
        },
      },
    },
  },
};

const Table: ComponentStyleConfig = {
  sizes: {
    md: {
      th: {
        pt: 6,
        pb: 6,
      },
      td: {
        fontSize: 'sm',
      },
    },
  },
  variants: {
    striped: {
      bgColor: 'background.default',
      borderRadius: 16,
      table: {
        borderRadius: 16,
      },
      thead: {
        th: {
          color: 'text.primary',
          fontWeight: 900,
          bgColor: 'background.card',
          border: 'none',
        },
      },
      tbody: {
        tr: {
          _even: {
            td: {
              bgColor: 'background.card',
              border: 'none',
            },
          },
          _odd: {
            td: {
              bgColor: 'background.default',
              border: 'none',
            },
          },
        },
      },
    },
  },
};

const Menu: ComponentStyleConfig = {
  defaultProps: {
    autoSelect: FaAssistiveListeningSystems,
  },
  baseStyle: {
    button: {
      color: 'text.primary',
      bgColor: 'background.card',
      border: '1px solid',
      borderColor: 'text.accent',
      fontSize: 'sm',
    },
    list: {
      bgColor: 'background.card',
      border: 'none',
      boxShadow: '0 20px 20px 0 rgba(0,0,0,0.30)',
    },
    item: {
      color: 'text.primary',
      fontSize: 'sm',
      bgColor: 'background.card',
      pt: 3,
      pb: 3,
      _focus: {
        bgColor: 'background.gray',
      },
      _hover: {
        bgColor: 'background.gray',
      },
    },
  },
  variants: {
    outline: {
      button: {
        bg: 'transparent',
        borderWidth: 2,
        borderColor: 'background.border',
        borderRadius: 4,
      },
    },
  },
};

const Tooltip: ComponentStyleConfig = {
  baseStyle: {
    p: 4,
    borderRadius: 8,
    zIndex: 1,
  },
};

const Divider: ComponentStyleConfig = {
  baseStyle: {
    color: 'text.secondary',
    borderColor: 'background.border',
  },
};

const Accordion: ComponentStyleConfig = {
  baseStyle: {
    panel: {
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      bgColor: 'background.card',
      px: 4,
      py: 4,
    },
    container: {
      boxShadow: '0px 0px 24px 0px #0000000A',
    },
    button: {
      bgColor: 'background.card',
      borderRadius: 16,
      _hover: {
        bgColor: 'background.card',
      },
      _expanded: {
        mb: 0.5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
  },
};

const Modal: ComponentStyleConfig = {
  defaultProps: {
    size: 'lg',
  },
  baseStyle: {
    dialog: {
      bgColor: '#fff',
      px: 4,
      py: 8,
      borderRadius: 16,
    },
  },
  sizes: {
    xl: {
      dialog: {
        w: 'fit-content',
        maxW: 'unset',
        minW: 500,
      },
    },
  },
};

const Badge: ComponentStyleConfig = {
  baseStyle: {
    fontsize: 'xs',
  },
  variants: {
    success: {
      bgColor: '#FFFFFF',
      color: '#0ECB81',
    },
    warning: {
      bgColor: '#FFFFFF',
      color: '#FFCE57',
    },
    danger: {
      bgColor: '#FFFFFF',
      color: '#000000',
    },
    info: {
      bgColor: '#0d6dfd33',
      color: '#0d6efd',
    },
    error: {
      bgColor: '#FFFFFF',
      color: '#f6465d',
    },
  },
};

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
};
const Form: ComponentStyleConfig = {
  parts: [],
  variants: {
    floating: {
      // bgColor: '#000',
      container: {
        _focusWithin: {
          label: {
            ...activeLabelStyles,
          },
        },
        'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label': {
          ...activeLabelStyles,
        },
        label: {
          color: 'text.secondary',
          top: 0,
          left: 0,
          zIndex: 2,
          position: 'absolute',
          backgroundColor: 'background.default',
          pointerEvents: 'none',
          mx: 3,
          px: 1,
          my: 2,
          transformOrigin: 'left top',
        },
      },
    },
  },
};

const Switch: ComponentStyleConfig = {
  defaultProps: {
    colorScheme: 'brand.primary',
  },
};

const Checkbox: ComponentStyleConfig = {
  defaultProps: {
    colorScheme: 'brand.primary',
  },
};

// const Progress: ComponentStyleConfig = {
//   baseStyle: {
//     filledTrack: {
//       bg: 'inherit'
//     }
//   },
//   variants: {
//     sold: {
//       filledTrack: {
//         bg: '#0ECB81'
//       },
//       track: {
//         bg: '#B7EFD9'
//       }
//     }
//   }
// }

const Card: ComponentStyleConfig = {
  baseStyle: {
    header: {
      paddingBottom: 'calc(var(--card-padding) / 2)',
    },
    body: {
      paddingTop: 'calc(var(--card-padding) / 2)',
    },
  },
};

const customTheme = extendTheme({
  colors: {
    text: {
      primary: '#000',
      secondary: '#999999',
      accent: '#0DB774',
      blue: '#1879EC',
    },
    brand: {
      primary: {
        50: '#efe4ff',
        100: '#cdb3ff',
        200: '#a37ef2',
        300: '#8a4dfe',
        400: '#6a1cfd',
        500: '#5103e4',
        600: '#3e01b2',
        700: '#2c0080',
        800: '#1b004f',
        900: '#0a001f',
      },
      info: {
        50: '#dff1ff',
        100: '#afd2ff',
        200: '#7eb3ff',
        300: '#4c95ff',
        400: '#1b77fd',
        500: '#025de4',
        600: '#0048b2',
        700: '#003480',
        800: '#001f50',
        900: '#000a20',
      },
      success: {
        50: '#dbfff3',
        100: '#b0fbdf',
        200: '#84f8ca',
        300: '#55f3b7',
        400: '#28f0a2',
        500: '#0fd788',
        600: '#02a769',
        700: '#00774b',
        800: '#00492b',
        900: '#001a0b',
      },
      warning: {
        50: '#ffefdb',
        100: '#ffd5ae',
        200: '#ffba7e',
        300: '#ff9e4c',
        400: '#ff831a',
        500: '#e66900',
        600: '#b45200',
        700: '#813900',
        800: '#4f2200',
        900: '#200900',
      },
      danger: {
        50: '#ffe5e9',
        100: '#f9bcc2',
        200: '#ee919a',
        300: '#e66673',
        400: '#dd3b4b',
        500: '#c42231',
        600: '#991826',
        700: '#6e101a',
        800: '#44070e',
        900: '#1e0001',
      },
    },
    background: {
      default: '#FFFFFF',
      darker: '#141416',
      card: '#fff',
      border: '#E6E6E6',
      gray: '#e6e6e6',
    },
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        fontFamily: 'InterTight',
        bgColor: 'background.default',
        color: 'text.primary',
      },
      // styles for the `a`
      a: {
        _hover: {
          color: 'inherit',
          // textDecoration: 'underline',
        },
      },
      '.filter-gray': {
        filter:
          'invert(67%) sepia(0%) saturate(621%) hue-rotate(262deg) brightness(93%) contrast(82%)',
      },
      '.filter-black': {
        filter: 'brightness(0%)',
      },
    },
  },
  components: {
    Tabs,
    Text,
    Heading,
    Button,
    Image,
    Table,
    Menu,
    Tooltip,
    Divider,
    Accordion,
    Modal,
    Badge,
    Form,
    Switch,
    Checkbox,
    Card,
    // Progress
  },
});

export default customTheme;
