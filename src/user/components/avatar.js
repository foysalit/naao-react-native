import React from 'react';
import { Thumbnail } from 'native-base';

import { getProfilePic } from '../../images/api';
import DefaultAvatar from '../../shared/images/profile.pic.png';

export default ({ user }) => {
    let uri = getProfilePic(user);
    
    return (
        <Thumbnail source={uri ? { uri } : DefaultAvatar} />
    );
};