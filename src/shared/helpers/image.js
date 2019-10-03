
import { Platform } from "react-native";
import { ImagePicker, Permissions } from 'expo';

export const takePhoto = async (library = false) => {
    const method = library ? 'launchImageLibraryAsync' : 'launchCameraAsync';

    if (!library) {
        const camera = await Permissions.getAsync(Permissions.CAMERA);
        if (camera.status !== 'granted') {
            await Permissions.askAsync(Permissions.CAMERA);
        }

        const roll = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (roll.status !== 'granted') {
            await Permissions.askAsync(Permissions.CAMERA_ROLL);
        }
    }

    // ImagePicker.launchImageLibraryAsync requires Permissions.CAMERA_ROLL on iOS only
    if (library && Platform.OS === 'ios') {
        const roll = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (roll.status !== 'granted') {
            await Permissions.askAsync(Permissions.CAMERA_ROLL);
        }
    }

    let result = await ImagePicker[method]({
        allowsEditing: false,
        aspect: [4, 3],
        base64: true,
        quality: 0.8,
    });

    if (!result.cancelled) {
        const uri = 'data:image/jpeg;base64,' + result.base64;
        return uri;
    }

    return null;
};
