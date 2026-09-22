/**
 * Reflex QR & Verification Utility
 * Generates lightweight SVG QR-style verification codes and provides verification logic.
 */

// Generate a deterministic visual QR pattern SVG for a given delivery ID
export function generateDeliveryQR(deliveryId, size = 160) {
    if (!deliveryId) return "";
    
    // Hash deliveryId to generate deterministic matrix
    let hash = 0;
    for (let i = 0; i < deliveryId.length; i++) {
        hash = (hash << 5) - hash + deliveryId.charCodeAt(i);
        hash |= 0;
    }

    const gridSize = 15;
    const cellSize = size / gridSize;
    let rects = "";

    // Helper to check if point is in QR finder pattern corners (top-left, top-right, bottom-left)
    function isFinderPattern(r, c) {
        if (r < 5 && c < 5) return true; // Top-left
        if (r < 5 && c >= gridSize - 5) return true; // Top-right
        if (r >= gridSize - 5 && c < 5) return true; // Bottom-left
        return false;
    }

    // Helper for finder box
    function isFinderSolid(r, c) {
        // 5x5 corner squares with hollow ring
        const checkCorner = (row, col) => {
            if (row === 0 || row === 4 || col === 0 || col === 4) return true;
            if (row === 2 && col === 2) return true;
            return false;
        };
        if (r < 5 && c < 5) return checkCorner(r, c);
        if (r < 5 && c >= gridSize - 5) return checkCorner(r, c - (gridSize - 5));
        if (r >= gridSize - 5 && c < 5) return checkCorner(r - (gridSize - 5), c);
        return false;
    }

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            let fill = false;
            if (isFinderPattern(r, c)) {
                fill = isFinderSolid(r, c);
            } else {
                const charCode = deliveryId.charCodeAt((r * gridSize + c) % deliveryId.length);
                const pseudoBit = ((hash ^ (r * 17 + c * 31) ^ charCode) & 1) === 1;
                fill = pseudoBit;
            }

            if (fill) {
                rects += `<rect x="${(c * cellSize).toFixed(1)}" y="${(r * cellSize).toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" fill="#0f172a" />`;
            }
        }
    }

    return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="rounded-lg bg-white p-2 shadow-md">
        <rect width="${size}" height="${size}" fill="#ffffff"/>
        ${rects}
    </svg>
    `;
}

// Generate delivery verification token
export function getDeliveryHash(deliveryId) {
    return `RFX-${(deliveryId || "000").slice(-6).toUpperCase()}`;
}
