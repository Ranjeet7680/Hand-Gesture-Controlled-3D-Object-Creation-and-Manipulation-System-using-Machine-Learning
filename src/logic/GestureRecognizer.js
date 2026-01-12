export const Gestures = {
    CLOSED_FIST: 'CLOSED_FIST',
    OPEN_PALM: 'OPEN_PALM',
    ONE_FINGER_UP: 'ONE_FINGER_UP',
    TWO_FINGERS_UP: 'TWO_FINGERS_UP',
    THREE_FINGERS_UP: 'THREE_FINGERS_UP',
    THUMB_UP: 'THUMB_UP',
    NONE: 'NONE'
};

export class GestureRecognizer {
    static predict(landmarks) {
        if (!landmarks || landmarks.length === 0) return Gestures.NONE;

        const fingers = this.getFingerStates(landmarks);
        const thumbIsOpen = !fingers[0]; // Thumb logic is inverted/different usually? No, getFingerStates handles it.
        // Actually, let's define getFingerStates properly.

        // Count open fingers (excluding thumb for simple counting sometimes, but here we count all)
        const openFingersCount = fingers.filter(f => f).length;

        // Specific combos
        const [thumb, index, middle, ring, pinky] = fingers;

        // CLOSED FIST: 0 or 1 finger (maybe thumb) open? Strictly 0 is better.
        if (openFingersCount === 0) return Gestures.CLOSED_FIST;
        if (openFingersCount === 5) return Gestures.OPEN_PALM;

        // ONE FINGER UP (Index only)
        if (index && !middle && !ring && !pinky) return Gestures.ONE_FINGER_UP;

        // TWO FINGERS UP (Index + Middle)
        if (index && middle && !ring && !pinky) return Gestures.TWO_FINGERS_UP;

        // THREE FINGERS UP (Index + Middle + Ring)
        if (index && middle && ring && !pinky) return Gestures.THREE_FINGERS_UP;

        // THUMB UP (Thumb only - and maybe oriented up?)
        // For simplicity: Thumb open, others closed
        if (thumb && !index && !middle && !ring && !pinky) return Gestures.THUMB_UP;

        return Gestures.NONE;
    }

    static getFingerStates(landmarks) {
        // Returns array of booleans [thumb, index, middle, ring, pinky]
        // true = open, false = closed

        const fingers = [];

        // Thumb: compare tip x to ip x (depending on handedness? assume right hand for now or check relative to wrist)
        // Better: Compare Tip to Pinky MCP distance vs IP to Pinky MCP? 
        // Simple heuristic: Thumb Tip x is "outside" of IP x relative to palm.
        // Or simplified: based on distance to wrist? No, thumb folds differently.
        // Standard geometric check:
        // Thumb is open if tip is farther from pinky MCP than IP is? 
        // Let's use a simpler check: Angle or Euclidean distance between Tip and other fingers.
        // HEURISTICS:
        // Thumb: Check if tip.x < ip.x (for Right hand) - NO, hand can rotate.
        // Robust check: Distance(Tip, Wrist) > Distance(IP, Wrist) usually works for all fingers?
        // No, for thumb, folding brings it closer to index MCP.

        // Let's verify "Open" by checking if Tip is higher (smaller y) than PIP/MCP? 
        // Works for upright hand. User prompt says "Hand Gesture Controls".
        // Let's assume upright hand interaction.

        // Thumb (4), Index (8), Middle (12), Ring (16), Pinky (20)
        // Pseudolandmarks:
        // Thumb: 1-4. Compare 4.x with 3.x? 

        // General "Extended" Check for fingers 2-5:
        // Tip (4n) distance to Wrist(0) > PIP (4n-2) distance to Wrist(0)

        const wrist = landmarks[0];

        // Thumb: Check angle or X-distance. 
        // Let's use simple distance from Index MCP (5).
        // If dist(ThumbTip, IndexMCP) > dist(ThumbIP, IndexMCP) -> Open?
        // Or simpler: ThumbTip to PinkyMCP > ThumbIP to PinkyMCP
        const thumbTip = landmarks[4];
        const thumbIP = landmarks[3];
        const pinkyMCP = landmarks[17];

        const dist = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

        fingers.push(dist(thumbTip, pinkyMCP) > dist(thumbIP, pinkyMCP));

        // Fingers 2-5
        const tips = [8, 12, 16, 20];
        const pips = [6, 10, 14, 18];

        for (let i = 0; i < 4; i++) {
            fingers.push(dist(landmarks[tips[i]], wrist) > dist(landmarks[pips[i]], wrist));
        }

        return fingers;
    }
}
