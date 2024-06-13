export function angleToDirection(angle) {
    // Convert angle to degrees
    var degrees = Phaser.Math.RadToDeg(angle);

    // Determine the direction based on the angle in degrees
    if (degrees >= -45 && degrees < 45) {
        return 'Right'; // Right (0 degrees)
    } else if (degrees >= 45 && degrees < 135) {
        return 'Front'; // Down (90 degrees)
    } else if (degrees >= 135 || degrees < -135) {
        return 'Left'; // Left (180 degrees)
    } else if (degrees >= -135 && degrees < -45) {
        return 'Back'; // Up (-90 degrees)
    } else {
        return 'Right'; // Default to right if angle is out of range
    }
}