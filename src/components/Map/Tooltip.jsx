import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useMapContext } from '../../context/MapContext';

const Tooltip = forwardRef((props, ref) => {
    const { tooltipData } = useMapContext();
    const { content, visible } = tooltipData;

    return createPortal(
        <div
            ref={ref}
            className={`custom-tooltip ${visible ? 'visible' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 1000,
                opacity: visible ? 1 : 0,
                // Initial transform to hide it off-screen or start at 0,0
                // We will update transform directly via JS for performance
            }}
        >
            {content}
        </div>,
        document.body
    );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
