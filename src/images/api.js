import { isString } from 'lodash';
import Meteor from 'react-native-meteor';

export const Images = Meteor.collection('images');

export const getProfilePic = (user = {}) => {
    if (!user)
        return null;

    const image = Images.findOne({ 'meta.module': 'user', 'meta.parentId': user._id });

    if (!image)
        return null;

    return formatFleURL(image);
};


const formatFleURL = (fileRef = {}, version = 'original') => {
    let ext;

    const _root = Meteor.getData()._endpoint
        .replace(/\/+$/, '')
        .replace('ws://', 'http://')
        .replace('wss://', 'https://')
        .replace('/websocket', '');
    const vRef = (fileRef.versions && fileRef.versions[version]) || fileRef || {};

    if (isString(vRef.extension)) {
        ext = `.${vRef.extension.replace(/^\./, '')}`;
    } else {
        ext = '';
    }

    if (fileRef.public === true) {
        return _root + (version === 'original' ? `${fileRef._downloadRoute}/${fileRef._id}${ext}` : `${fileRef._downloadRoute}/${version}-${fileRef._id}${ext}`);
    }
    return _root + `${fileRef._downloadRoute}/${fileRef._collectionName}/${fileRef._id}/${version}/${fileRef._id}${ext}`;
};