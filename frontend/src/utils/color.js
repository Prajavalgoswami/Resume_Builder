// src/utils/colors.js
export const fixTailwindColors = (element) => {
    const clone = element.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.width = `${element.offsetWidth}px`;
    document.body.appendChild(clone);
  
    // Remove oklch colors, fallback to #222
    const convertOklch = (value) => {
      const oklchRegex = /oklch\(([^)]+)\)/g;
      return value.replace(oklchRegex, () => '#222');
    };
  
    // Process all elements
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(el => {
      const computed = window.getComputedStyle(el);
      if (computed.backgroundColor.includes('oklch')) {
        el.style.backgroundColor = '#222';
      }
      if (computed.color.includes('oklch')) {
        el.style.color = '#222';
      }
      if (computed.borderColor.includes('oklch')) {
        el.style.borderColor = '#222';
      }
    });
  
    return clone;
  };

  //it a helper function