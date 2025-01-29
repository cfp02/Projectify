export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    cardBackground: string;
    primary: string;
    secondary: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: {
      default: string;
      hover: string;
    };
    status: {
      active: {
        text: string;
        background: string;
      };
      inactive: {
        text: string;
        background: string;
      };
    };
    tag: {
      background: string;
      text: string;
      border: string;
    };
  };
  gradients: {
    heading: string;
    cardHover: string;
  };
  shadows: {
    hover: string;
    button: string;
  };
}

export const themes: { [key: string]: Theme } = {
  tokyoNight: {
    id: 'tokyoNight',
    name: 'Tokyo Night',
    colors: {
      background: '#1a1b26',
      cardBackground: '#24273a',
      primary: '#7aa2f7',
      secondary: '#bb9af7',
      text: {
        primary: '#c0caf5',
        secondary: '#a9b1d6',
        muted: '#565f89',
      },
      border: {
        default: 'rgba(86, 95, 137, 0.5)',
        hover: 'rgba(122, 162, 247, 0.3)',
      },
      status: {
        active: {
          text: '#9ece6a',
          background: 'rgba(158, 206, 106, 0.1)',
        },
        inactive: {
          text: '#565f89',
          background: 'rgba(86, 95, 137, 0.2)',
        },
      },
      tag: {
        background: '#1a1b26',
        text: '#7dcfff',
        border: '#1a1b26',
      },
    },
    gradients: {
      heading: 'from-[#7aa2f7] to-[#7dcfff]',
      cardHover: 'from-[#7aa2f7]/3 to-[#7dcfff]/3',
    },
    shadows: {
      hover: '0_0_25px_rgba(122,162,247,0.1)',
      button: '0_0_15px_rgba(122,162,247,0.3)',
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      background: '#13111C',
      cardBackground: '#1A1721',
      primary: '#F92AAD',
      secondary: '#2AFFEA',
      text: {
        primary: '#ffffff',
        secondary: '#c2c2c2',
        muted: '#666666',
      },
      border: {
        default: 'rgba(249, 42, 173, 0.2)',
        hover: 'rgba(42, 255, 234, 0.3)',
      },
      status: {
        active: {
          text: '#2AFFEA',
          background: 'rgba(42, 255, 234, 0.1)',
        },
        inactive: {
          text: '#666666',
          background: 'rgba(102, 102, 102, 0.2)',
        },
      },
      tag: {
        background: '#13111C',
        text: '#F92AAD',
        border: '#13111C',
      },
    },
    gradients: {
      heading: 'from-[#F92AAD] to-[#2AFFEA]',
      cardHover: 'from-[#F92AAD]/3 to-[#2AFFEA]/3',
    },
    shadows: {
      hover: '0_0_25px_rgba(249,42,173,0.1)',
      button: '0_0_15px_rgba(42,255,234,0.3)',
    },
  },
  emeraldSea: {
    id: 'emeraldSea',
    name: 'Emerald Sea',
    colors: {
      background: '#1a1b26',
      cardBackground: '#24273a',
      primary: '#34d399',
      secondary: '#22d3ee',
      text: {
        primary: '#f3f4f6',
        secondary: '#9ca3af',
        muted: '#4b5563',
      },
      border: {
        default: 'rgba(75, 85, 99, 0.5)',
        hover: 'rgba(52, 211, 153, 0.3)',
      },
      status: {
        active: {
          text: '#34d399',
          background: 'rgba(52, 211, 153, 0.1)',
        },
        inactive: {
          text: '#4b5563',
          background: 'rgba(75, 85, 99, 0.2)',
        },
      },
      tag: {
        background: '#1a1b26',
        text: '#22d3ee',
        border: '#164e63',
      },
    },
    gradients: {
      heading: 'from-emerald-400 to-cyan-400',
      cardHover: 'from-emerald-500/3 to-cyan-500/3',
    },
    shadows: {
      hover: '0_0_25px_rgba(52,211,153,0.1)',
      button: '0_0_15px_rgba(52,211,153,0.3)',
    },
  },
}; 